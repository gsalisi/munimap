'use strict';

function fetchMapData() {
    const promises = [];
    promises.push(fetch('arteries.json'));
    promises.push(fetch('neighborhoods.json'));
    promises.push(fetch('streets.json'));
    promises.push(fetch('freeways.json'));

    return Promise.all(promises).then((responses) => {
        return Promise.all(responses.map(r => r.json()))
    });
}

function renderMap(projection, $map, [arteries, neigh, streets, freeways]) {
    const width = 1200;
    const height = 900;

    projection.scale(331400)
        .center([-122.431297, 37.773972])
        .translate([width / 2, height / 2]);
    const path = d3.geoPath(projection);

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
}


function fetchRoutes() {
    fetch('routes').then((d) => {
        // console.log(d);
    });
}

function renderVehicles(projection, map, vehicles) {
    map.selectAll('.vehicle').remove();
    map.selectAll("circle")
        .data(vehicles)
        .enter()
        .append("circle")
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy",  d => projection([d.lon, d.lat])[1])
        .attr("id", d => d.id)
        .attr("r", "8px")
        .attr("fill", "red")
        .attr("class", "vehicle");
}

function extractVehicleCoordinates(vehicleLocationsResp) {
    if (!vehicleLocationsResp.body.vehicle) {
        return;
    } else if (!Array.isArray(vehicleLocationsResp.body.vehicle)) {
        const v = vehicleLocationsResp.body.vehicle;
        return [v];
    }
    return vehicleLocationsResp.body.vehicle;
}

function fetchVehicleLocations(vehicleTag) {
    return fetch(`locations?r=${vehicleTag}`).then((response) => {
        if (response.status !== 200) {
            console.log(response);
        } else {
            return response.json();
        }
    });
}

function fetchRouteConfig() {
    fetch('routeConfig?r:J').then((resp) => {
    });
}

function main() {

    const projection = d3.geo.mercator();
    const $map = d3.select('.map');
    const vehicleTag = 'J';

    // fetchRoutes();
    fetchMapData().then((mapData) => {
        renderMap(projection, $map, mapData);
        return fetchVehicleLocations(vehicleTag)
    }).then(vehicleLocationsResp => {
        const coors = extractVehicleCoordinates(vehicleLocationsResp);
        renderVehicles(projection, $map, coors);
    });

    setTimeout(() => {
        setInterval(() => {
            fetchVehicleLocations(vehicleTag).then((vlr) => {
                renderVehicles(projection, $map, extractVehicleCoordinates(vlr));
            })
        }, 3000);
    },5000);

}

main();
