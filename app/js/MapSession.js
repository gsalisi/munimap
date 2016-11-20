import DataService from './DataService.js';

export default class MapSession {
    constructor(vehicleTag, sessionSVG) {
        this.projection = d3.geo.mercator()
            .scale(331400)
            .center([-122.431297, 37.773972])
            .translate([1200 / 2, 900 / 2]);
        this.vehicleTag = vehicleTag;
        this.vehicleMap = new Map();
        const width = 1200;
        const height = 900;
        this.sessionSVG = sessionSVG;
        this.geoPath = d3.geoPath(this.projection);
        this.routeColor = '#FFE3AE';

        DataService.fetchRouteConfig(vehicleTag).then((routeData) => {
            this.routeColor = routeData.color;
            this.routeColorOpposite = routeData.oppositeColor;
            this.renderRoute(routeData)
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
        // Really want to animate this movement but no time :(
        this.sessionSVG.selectAll(`.vehicle-${this.vehicleTag}`).remove();
        this.sessionSVG.selectAll(`.vehicle-direction-${this.vehicleTag}`).remove();

        this.sessionSVG.selectAll(`circle.vehicle-${this.vehicleTag}`)
            .data(vehicles)
            .enter()
            .append('circle')
            .attr('cx', d => this.projection([d.lon, d.lat])[0])
            .attr('cy',  d => this.projection([d.lon, d.lat])[1])
            .attr('id', d => d.id)
            .attr('r', '8px')
            .attr('fill', `#${this.routeColor}`)
            .attr('stroke', `#${this.routeColorOpposite}`)
            .attr('opacity', '0.85')
            .attr('stroke-width', '3px')
            .attr('class', `vehicle vehicle-${this.vehicleTag}`);

        this.sessionSVG.selectAll(`polyline.vehicle-direction-${this.vehicleTag}`)
            .data(vehicles)
            .enter()
            .append('polyline')
            .attr('class', `vehicle-direction vehicle-direction-${this.vehicleTag}`)
            .attr('points', d => {
                const xCenter = this.projection([d.lon, d.lat])[0];
                const yCenter = this.projection([d.lon, d.lat])[1];
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
                const xCenter = this.projection([d.lon, d.lat])[0];
                const yCenter = this.projection([d.lon, d.lat])[1];
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
            .attr('cx', d => this.projection([d.lon, d.lat])[0])
            .attr('cy',  d => this.projection([d.lon, d.lat])[1])
            .attr('id', d => d.id)
            .attr('r', '3px')
            .attr('fill', `#${this.routeColorOpposite}`)
            .attr('opacity', '0.4')
            .attr('class', `routestops-${this.vehicleTag}`)
            .append("svg:title")
            .text(d => d.title);
    }

    destroy() {
        window.clearInterval(this.intervalID);
        this.sessionSVG.selectAll(`.routepath-${this.vehicleTag}`).remove();
        this.sessionSVG.selectAll(`.routestops-${this.vehicleTag}`).remove();
        this.sessionSVG.selectAll(`.vehicle-${this.vehicleTag}`).remove();
        this.sessionSVG.selectAll(`.vehicle-direction-${this.vehicleTag}`).remove();
    }
}
