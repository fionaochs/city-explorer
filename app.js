const express = require('express');
// Application Dependencies

const app = express();
// get the port on which to run the server

const geoData = require('./data/geo.json');
const request = require('superagent');
// const weatherData = require('./data/darksky.json');
const port = process.env.PORT || 3000;



function toLocation() {
    const firstResult = geoData.results[0];
    //${searchterm}
    const geometry = firstResult.geometry;
    return {
        formatted_query: firstResult.formatted_address,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
    };
}

function getLatLong(location) {
    // simulate an error if special "bad location" is provided:
    if (location === 'bad location') {
        throw new Error();
    }
    // convert to data format
    return toLocation(geoData);
}

function getWeather(lat, lng) {
    const weatherData = ;
    // URL with API key ${lat,lng}
    return request.get(URL)
    .then(response => {
        return formatWeather(response);
    });
}
function formatWeather(){

    return {
        "forecast": "Partly cloudy until afternoon.",
        "time": "Mon Jan 01 2001"
      }
}

// API Routes
// app.<verb>(<noun>, handler);
app.get('/location', (request, response) => {

    const location = request.query.location;
    const result = getLatLong(location);
    response.status(200).json(result);

});

app.listen(port, () => {
    console.log('server running', port);
});