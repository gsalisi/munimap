'use strict';

class DataService {
    static fetchRoutes() {
        fetch('routes').then((d) => {
            // console.log(d);
        });
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
        });
    }

    static fetchRouteConfig(vehicleTag) {
        return fetch(`routeConfig?r=${vehicleTag}`).then((response) => {
            if (response.status !== 200) {
                console.log(response);
            } else {
                return response.json();
            }
        });
    }
}

class SFMap {
    constructor(mapData, sessionData) {
        this.projection = d3.geo.mercator();
        this.svg = d3.select('.map');
        this._renderMap(mapData);
    }

    _renderMap([arteries, neigh, streets, freeways]) {
        const width = 1200;
        const height = 900;

        this.projection.scale(331400)
            .center([-122.431297, 37.773972])
            .translate([width / 2, height / 2]);
        const path = d3.geoPath(this.projection);

        this.svg.selectAll('path')
            .data(neigh.features)
            .enter()
            .append('path')
            .attr('class', 'neighborhoods')
            .attr('d', path);
        this.svg.selectAll('path')
            .data(freeways.features)
            .enter()
            .append('path')
            .attr('class', 'freeways')
            .attr('d', path);
        this.svg.selectAll('path')
            .data(arteries.features)
            .enter()
            .append('path')
            .attr('class', 'arteries')
            .attr('d', path);

        this.svg.selectAll('path')
            .data(streets.features)
            .enter()
            .append('path')
            .attr('class', 'streets')
            .attr('d', path);
    }

    renderVehicles(vehicles) {
        this.svg.selectAll('.vehicle').remove();
        this.svg.selectAll("circle")
            .data(vehicles)
            .enter()
            .append("circle")
            .attr("cx", d => this.projection([d.lon, d.lat])[0])
            .attr("cy",  d => this.projection([d.lon, d.lat])[1])
            .attr("id", d => d.id)
            .attr("r", "6px")
            .attr("fill", "red")
            .attr("class", "vehicle");
    }

    renderRoute(route) {

    }
}

class MapSession {
    // color
    // path
    // title

}

class MapUtil {
    normalizeVehicles(vehicleLocationsResp) {
        if (!vehicleLocationsResp.body && !vehicleLocationsResp.body.vehicle) {
            return;
        } else if (!Array.isArray(vehicleLocationsResp.body.vehicle)) {
            const v = vehicleLocationsResp.body.vehicle;
            return [v];
        }
        return vehicleLocationsResp.body.vehicle;
    }
}

function main() {
    let sfMap;
    const mapUtil = new MapUtil();

    const vehicleMap = new Map();
    const vehicleTag = 'J';

    const mapPromise = DataService.fetchMapData().then((mapData) => {
        sfMap = new SFMap(mapData);
    });

    mapPromise.then(() => updateVehicleLocations());
    mapPromise.then(() => DataService.fetchRouteConfig(vehicleTag));

    const startMapRefresh = function() {
        setTimeout(() => {
            setInterval(() => {
                updateVehicleLocations();
            }, 2000);
        }, 5000);
    }

    // startMapRefresh();

    function updateVehicleLocations() {
         DataService.fetchVehicleLocations(vehicleTag).then(vehicleLocationsResp => {
            const vehicles = mapUtil.normalizeVehicles(vehicleLocationsResp);
            if (vehicles) {
                vehicles.forEach((v) => vehicleMap.set(v.id, v));
                const newValues = [];
                for(let v of vehicleMap.values()) {
                    newValues.push(v);
                }
                sfMap.renderVehicles(newValues);
            }
        });
    }

    document.querySelector('#refreshBtn').addEventListener('click', () => {
        updateVehicleLocations();
    })
}


main();
