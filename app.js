const express = require('express');

const app = express();
const geoJSON = require('./data/geo.json');
const superagent = require('superagent');

const port = process.env.PORT || 3000;

let lat;
let long;

const formatLocationResponse = locationItem => {
    const {
        geometry: {
            location: {
                lat,
                long,
            }
        },
        formattedAddress,
    } = locationItem;


    return {
        'formatted_query': formattedAddress,
        'latitude': lat,
        'longitude': long
    };
};

const getWeatherResponse = async (lat, long) => {
    const weatherData = await superagent.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${long}`);
    return {
        'forecast': 'Mostly cloudy in the morning.',
        'time': 'Tue Jan 02 2001'
    };
};
app.get('/location', (rec, res) => {
    const searchQuery = req.query.search;

    const response = formatLocationResponse(item);
    res.json(response);
});
