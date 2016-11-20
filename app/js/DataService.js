export default class DataService {
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