
export default class SFMap {
    constructor(mapData) {
        const projection = d3.geo.mercator()
            .scale(331400)
            .center([-122.431297, 37.773972])
            .translate([1200 / 2, 900 / 2]);
        this.mapSVG = d3.select('.map');
        this.sessionSVG = d3.select('.overlay');
        this.geoPath = d3.geoPath(projection);
        this._renderMap(mapData);
    }

    _renderMap([arteries, neigh, streets, freeways]) {

        // No time to figure out how to place the street labels properly
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
    }
}
