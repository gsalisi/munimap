'use strict';

var width = 900;
var height = 600;
var projection = d3.geo.mercator()
    .scale(220400)
    .center([-122.431297, 37.773972])
    .translate([width / 2, height / 2]);

var path = d3.geoPath(projection);

var $map = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

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
});

// d3.json('arteries.json', function(error, sf) {

// });

d3.json('freeways.json', function(error, sf) {
});

// d3.json('neighborhoods.json', function(error, sf) {
// });

// d3.json('streets.json', function(error, sf) {
// });
