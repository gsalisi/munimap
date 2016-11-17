const express = require('express');
const request = require('request');
const querystring = require('querystring');
const xml2json = require('xml2json');
const app = express();

const NEXTBUS_API = 'http://webservices.nextbus.com/service/publicXMLFeed?'
const NEXTBUS_PARAM_DEFAULT = {
    a: 'sf-muni'
};

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/asset'));

app.get('/', (req, res) => {
  res.sendfile('index.html', {root: './app'});
});

app.get('/locations', (req, res) => {
    const queryObj = {
        command: 'vehicleLocations',
        t: ((new Date()).getTime()-10000).toString()
    };
    Object.assign(queryObj, NEXTBUS_PARAM_DEFAULT, req.query);
    console.log(queryObj);
    request.get({
        url: NEXTBUS_API,
        qs: queryObj,
        useQuerystring: true
    }, (err, r, body) => {
        if (err) {
            res.send(err);
        } else {
            res.send(xml2json.toJson(body));
        }
    });
});

app.get('/routes', (req, res) => {
    const queryObj = {
        command: 'routeList',
    };
    Object.assign(queryObj, NEXTBUS_PARAM_DEFAULT);
    request.get({
        url: NEXTBUS_API,
        qs: queryObj,
        useQuerystring: true
    }, (err, r, body) => {
        if (err) {
            res.send(err);
        } else {
            res.send(xml2json.toJson(body));
        }
    });
})

app.get('/routeConfig', (req, res) => {
    const queryObj = {
        command: 'routeConfig',
    };
    Object.assign(queryObj, NEXTBUS_PARAM_DEFAULT, req.query);
    request.get({
        url: NEXTBUS_API,
        qs: queryObj,
        useQuerystring: true
    }, (err, r, body) => {
        if (err) {
            res.send(err);
        } else {
            res.send(xml2json.toJson(body));
        }
    });
})

app.listen(app.get('port'),() => {
  console.log('Node app is running on port', app.get('port'));
});
