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
    const query = {};
    const routeQuery = {
        command: 'vehicleLocations',
        t: (new Date()).getTime().toString()
    };
    Object.assign(query, NEXTBUS_PARAM_DEFAULT, routeQuery, req.query)
    console.log(`${NEXTBUS_API}${querystring.stringify(query)}`);
    request.get(`${NEXTBUS_API}${querystring.stringify(query)}`, (a, b, d) => {
        console.log(d);
        res.send(xml2json.toJson(d));
    });
});

app.get('/routes', (req, res) => {
    res.send('test');
})

app.listen(app.get('port'),() => {
  console.log('Node app is running on port', app.get('port'));
});
