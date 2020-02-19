const express = require('express');
// Application Dependencies

app.use(cors());
const cors = require('cors');
const app = express();
// get the port on which to run the server

const geoData = require('./data/geo.json');
const request = require('superagent');
// const weatherData = require('./data/darksky.json');
const port = process.env.PORT || 3000;

let lat;
let lng;


function getLatLong(location) {
    // simulate an error if special "bad location" is provided:
    if (location === 'bad location') {
        throw new Error();
    }
    // convert to data format
    return toLocation(geoData);
}

function toLocation() {
    const locationResult = geoData.results[0];
    //${searchterm}
    const geometry = locationResult.geometry;
    return {
        formatted_query: locationResult.formatted_address,
        latitude: geometry.location.lat,
        longitude: geometry.location.lng
    };
}
async function getWeather(lat, lng) {
    //https://api.darksky.net/forecast/dae342dd4e94b99bd975455ffef63010/37.8267,-122.4233
    // URL with API key ${lat,lng}
    const weatherData = await request.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`);
    
    return request.get(weatherData).then(response => {
        return formatWeather(response);
    });
}
function formatWeather(weatherData){
    const weatherInfo = weatherData.daily.data[0];
    return {
        'forecast': weatherInfo.summary,
        'time': new Date(weatherInfo.time * 1000).toDateString()
    };
}

// API Routes
// app.<verb>(<noun>, handler);
// location route
app.get('/location', (request, response) => {

    const location = request.query.location;
    const latLngResult = getLatLong(location);
    response.json(latLngResult);

});
// weather route
app.get('/weather', (request, response) => {
    const lat = request.query.weather;
    const lng = ;

    const weatherResult = getWeather(lat, lng);
    response.json(weatherResult);

});

// need to listen to see if port running
app.listen(port, () => {
    console.log('server running', port);
});