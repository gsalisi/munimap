'use strict';

const MERCATOR_PROJECTION = d3.geo.mercator()
            .scale(331400)
            .center([-122.431297, 37.773972])
            .translate([1200 / 2, 900 / 2]);

const MAX_SELECTION = 3;

class DataService {
    static fetchRoutes() {
        return fetch('routes').then((response) => {
            if (response.status !== 200) {
                console.log(response);
            } else {
                return response.json();
            }
        }).then((route) => route.body && route.body.route);
    }

    static fetchMapData() {
        const promises = [];
        promises.push(fetch('arteries.json'));
        promises.push(fetch('neighborhoods.json'));
        promises.push(fetch('streets.json'));
        promises.push(fetch('freeways.json'));

        return Promise.all(promises).then((responses) => {
            return Promise.all(responses.map(r => r.json()))
        });
    }

    static fetchVehicleLocations(vehicleTag) {
        return fetch(`locations?r=${vehicleTag}`).then((response) => {
            if (response.status !== 200) {
                console.log(response);
            } else {
                return response.json();
            }
        }).then((data) => DataService._normalizeVehicles(data));
    }

    static _normalizeVehicles(vehicleLocationsResp) {
        if (!vehicleLocationsResp.body || !vehicleLocationsResp.body.vehicle) {
            return;
        } else if (!Array.isArray(vehicleLocationsResp.body.vehicle)) {
            const v = vehicleLocationsResp.body.vehicle;
            return [v];
        }
        return vehicleLocationsResp.body.vehicle;
    }

    static fetchRouteConfig(vehicleTag) {
        return fetch(`routeConfig?r=${vehicleTag}`).then((response) => {
            if (response.status !== 200) {
                console.log(response);
            } else {
                return response.json();
            }
        }).then((route) => route.body && route.body.route);
    }
}

class SFMap {
    constructor(mapData) {
        this.mapSVG = d3.select('.map');
        this.sessionSVG = d3.select('.overlay');
        this.geoPath = d3.geoPath(MERCATOR_PROJECTION);
        this._renderMap(mapData);
    }

    _renderMap([arteries, neigh, streets, freeways]) {
        this.mapSVG.selectAll('path.neighborhoods')
            .data(neigh.features)
            .enter()
            .append('path')
            .attr('class', 'neighborhoods')
            .attr('d', this.geoPath);
        this.mapSVG.selectAll('path.freeways')
            .data(freeways.features)
            .enter()
            .append('path')
            .attr('class', 'freeways')
            .attr('d', this.geoPath);
        this.mapSVG.selectAll('path.arteries')
            .data(arteries.features)
            .enter()
            .append('path')
            .attr('class', 'arteries')
            .attr('d', this.geoPath);
        const streetPaths = this.mapSVG.selectAll('path.streets')
            .data(streets.features)
            .enter()
            .append('path')
            .attr('class', 'streets')
            .attr('d', this.geoPath);
        // streetPaths.append("text")
        //     .attr("transform", d => {
        //         return "translate(" + this.geoPath.centroid(d) + ")"
        //     })
        //     .attr("font-size", '2px')
        //     .attr("dy", "2px")
        //     .text(d => d.properties.STREETNAME);
    }
}

class Toolbar {
    constructor(routes) {
        this.$container = document.querySelector('.checkbox-container');
        this._routes = routes;
        this._renderRoutesList(routes);
    }

    _renderRoutesList(routes) {
        const listHtml = [];
        routes.forEach((r) => {
            listHtml.push(
                `<label class="route-item">
                    <input type="checkbox" value="${r.tag}" class="js-route-checkbox"
                        onclick="onRouteSelectionChange(this)">
                    ${r.title}
                </label><br>`);
        });
        this.$container.innerHTML = listHtml.join('\n');
    }
}

class MapSession {
    constructor(vehicleTag, sessionSVG) {
        this.vehicleTag = vehicleTag;
        this.vehicleMap = new Map();
        const width = 1200;
        const height = 900;
        this.sessionSVG = sessionSVG;
        this.geoPath = d3.geoPath(MERCATOR_PROJECTION);
        this.routeColor = '#FFE3AE';

        DataService.fetchRouteConfig(vehicleTag).then((routeData) => {
            this.renderRoute(routeData)
            this.routeColor = routeData.color;
            this.routeColorOpposite = routeData.oppositeColor;
            // this.updateVehicleLocations();
            this.intervalID = this.autoRefresh();
        });
    }

    autoRefresh() {
        return window.setInterval(() => {
            this.updateVehicleLocations();
        }, 2000);
    }

    updateVehicleLocations() {
        return DataService.fetchVehicleLocations(this.vehicleTag).then(vehicles => {
            if (vehicles) {
                vehicles.forEach((v) => this.vehicleMap.set(v.id, v));
                const newValues = [];
                for(let v of this.vehicleMap.values()) {
                    newValues.push(v);
                }
                this.renderVehicles(newValues);
            }
        });
    }

    renderVehicles(vehicles) {
        this.sessionSVG.selectAll(`.vehicle-${this.vehicleTag}`).remove();
        this.sessionSVG.selectAll(`.vehicle-direction-${this.vehicleTag}`).remove();

        this.sessionSVG.selectAll(`circle.vehicle-${this.vehicleTag}`)
            .data(vehicles)
            .enter()
            .append('circle')
            .attr('cx', d => MERCATOR_PROJECTION([d.lon, d.lat])[0])
            .attr('cy',  d => MERCATOR_PROJECTION([d.lon, d.lat])[1])
            .attr('id', d => d.id)
            .attr('r', '8px')
            .attr('fill', `#${this.routeColor}`)
            .attr('stroke', `#${this.routeColorOpposite}`)
            .attr('opacity', '0.7')
            .attr('stroke-width', '3px')
            .attr('class', `vehicle vehicle-${this.vehicleTag}`);

        this.sessionSVG.selectAll(`polyline.vehicle-direction-${this.vehicleTag}`)
            .data(vehicles)
            .enter()
            .append('polyline')
            .attr('class', `vehicle-direction vehicle-direction-${this.vehicleTag}`)
            .attr('points', d => {
                const xCenter = MERCATOR_PROJECTION([d.lon, d.lat])[0];
                const yCenter = MERCATOR_PROJECTION([d.lon, d.lat])[1];
                const x1 = xCenter - 4;
                const y1 = yCenter + 4;
                const x2 = x1 + 4;
                const y2 = y1 - 8;
                const x3 = xCenter + 4;
                const y3 = yCenter + 4;
                return `${x1}, ${y1}
                        ${x2}, ${y2}
                        ${x3}, ${y3}`;
            })
            .attr('stroke', `#${this.routeColorOpposite}`)
            .attr('fill', 'rgba(0, 0, 0, 0)')
            .attr('stroke-width', '2px')
            .attr('transform', d => {
                const xCenter = MERCATOR_PROJECTION([d.lon, d.lat])[0];
                const yCenter = MERCATOR_PROJECTION([d.lon, d.lat])[1];
                return `rotate(${d.heading} ${xCenter} ${yCenter})`
            });
    }

    renderRoute(route) {
        function toGeoJson(points) {
            return points.map(obj => {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: obj.point.map(p => [p.lon, p.lat, 0])
                    }
                };
            });
        }
        const routeData = toGeoJson(route.path);
        this.sessionSVG.selectAll(`path.routepath-${this.vehicleTag}`)
            .data(routeData)
            .enter()
            .append('path')
            .attr('fill', 'rgba(0, 0, 0, 0)')
            .attr('stroke-width', '6px')
            .attr('stroke', `#${route.color}`)
            .attr('opacity', '0.7')
            .attr('class', `routepath-${this.vehicleTag}`)
            .attr('d', this.geoPath);

        this.sessionSVG.selectAll(`circle.routestops-${this.vehicleTag}`)
            .data(route.stop)
            .enter()
            .append('circle')
            .attr('cx', d => MERCATOR_PROJECTION([d.lon, d.lat])[0])
            .attr('cy',  d => MERCATOR_PROJECTION([d.lon, d.lat])[1])
            .attr('id', d => d.id)
            .attr('r', '3px')
            .attr('fill', `#${this.routeColorOpposite}`)
            .attr('opacity', '0.4')
            .attr('class', `routestops-${this.vehicleTag}`)
    }

    destroy() {
        window.clearInterval(this.intervalID);
        const elems = [];
        elems.push(...this.sessionSVG[0][0].querySelectorAll(`.routepath-${this.vehicleTag}`));
        elems.push(...this.sessionSVG[0][0].querySelectorAll(`.vehicle-${this.vehicleTag}`));
        elems.forEach(e => e.outerHTML = '');
    }

}


function setupEventListeners(mapSessions) {
    const sessionSVG = d3.select('.overlay-container')
            .append('svg')
            .attr('class', 'overlay');

    // const nms = new MapSession('J', sessionSVG);
    // mapSessions['J'] = nms;

    window.onRouteSelectionChange = (cb) => {
        if (cb.checked) {
            if (Object.keys(mapSessions).length >= MAX_SELECTION) {
                alert('Please uncheck checked routes to select new ones.');
                cb.checked = false;
                return;
            }
            const nms = new MapSession(cb.value, sessionSVG);
            mapSessions[cb.value] = nms;
        } else {
            const nms = mapSessions[cb.value];
            nms.destroy();
            delete mapSessions[cb.value];
        }
    }
}

function main() {
    const $loader = document.querySelector('.loader');
    const mapSessions = {};

    DataService.fetchRoutes().then(routesData => new Toolbar(routesData));
    DataService.fetchMapData().then((mapData) => {
        $loader.style.display = 'none';
        new SFMap(mapData);
    }).then(() => {
        setupEventListeners(mapSessions);
    });
}


main();
