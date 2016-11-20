import SFMap from './js/SFMap.js';
import DataService from './js/DataService.js';
import Toolbar from './js/Toolbar.js';
import MapSession from './js/MapSession.js';

/*
 * No Frameworks here. Just plain JS. :)
 */

function setupEventListeners(mapSessions) {
    const MAX_SELECTION = 3;
    const sessionSVG = d3.select('.overlay-container')
            .append('svg')
            .attr('class', 'overlay');

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


const $loader = document.querySelector('.loader');
const mapSessions = {};

// Setup Toolbar
DataService.fetchRoutes().then(routesData => new Toolbar(routesData));
// Setup Map
DataService.fetchMapData().then((mapData) => {
    $loader.style.display = 'none';
    new SFMap(mapData);
}).then(() => {
    // Listen for new Map Sessions
    setupEventListeners(mapSessions);
});




