'use strict';

function buildMap() {
    const width = 900;
    const height = 600;
    const projection = d3.geo.mercator()
        .scale(220400)
        .center([-122.431297, 37.773972])
        .translate([width / 2, height / 2]);

    const path = d3.geoPath(projection);

    const $map = d3.select('.map');
    // if (localStorage[LOCAL_STORAGE_MAP_KEY]) {
    //     $map.innerHTML = localStorage.getItem(LOCAL_STORAGE_MAP_KEY);
    //     return;
    // }
    const promises = [];
    promises.push($.get('arteries.json'));
    promises.push($.get('neighborhoods.json'));
    promises.push($.get('streets.json'));
    promises.push($.get('freeways.json'));

    Promise.all(promises).then(([arteries, neigh, streets, freeways]) => {
        $map.selectAll('path')
            .data(neigh.features)
            .enter()
            .append('path')
            .attr('class', 'neighborhoods')
            .attr('d', path);
        $map.selectAll('path')
            .data(freeways.features)
            .enter()
            .append('path')
            .attr('class', 'freeways')
            .attr('d', path);
        $map.selectAll('path')
            .data(arteries.features)
            .enter()
            .append('path')
            .attr('class', 'arteries')
            .attr('d', path);

        $map.selectAll('path')
            .data(streets.features)
            .enter()
            .append('path')
            .attr('class', 'streets')
            .attr('d', path);

            // cache!
        // setTimeout(() => {
        //     const map = document.querySelector('.map');
        //     localStorage.setItem('''', map.innerHTML)
        //     localStorage.setItem(LOCAL_STORAGE_MAP_KEY, map.innerHTML)
        //     localStorage.setItem(LOCAL_STORAGE_MAP_KEY, map.innerHTML)
        // }, 2000);
    });
}

function buildOptions() {
    $.get('routes').then((d) => {
        console.log(d);
    });
}

function renderVehicleLocations() {

    const query = {r: '24'};

    $.get('locations', query).then((d) => {
        console.log(d);
    });
}




function main() {
    buildOptions();
    buildMap();
    renderVehicleLocations();
}

main();
