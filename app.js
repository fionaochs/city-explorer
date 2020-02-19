const express = require('express');
// Application Dependencies

const cors = require('cors');
require('dotenv').config();

const app = express();
// get the port on which to run the server
app.use(cors());

const geoData = require('./data/geo.json');
const request = require('superagent');
// const weatherData = require('./data/darksky.json');
const port = process.env.PORT || 3000;

let lat;
let lng;



// function toLocation(geoData) {
//     const searchQuery = request.query.search;
//     console.log(searchQuery);
//     const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

//     const locationResult = request.get(`https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${searchQuery}&format=json`);

//     const firstResult = locationResult.body[0];
//     return {
//         formatted_query: firstResult.display_name,
//         latitude: firstResult.lat,
//         longitude: firstResult.lon
//     };
// }
// async function getWeather(lat, lng) {
//     const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;

//     const weatherData = await request.get(`https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${lat},${lng}`);
    
//     return request.get(weatherData).then(respond => {
//         return formatWeather(respond);
//     });
// }
// function formatWeather(weatherData){
//     const weatherInfo = weatherData.daily.data[0];
//     return {
//         'forecast': weatherInfo.summary,
//         'time': new Date(weatherInfo.time * 1000).toDateString()
//     };
// }

// API Routes
// app.<verb>(<noun>, handler);
// location route
app.get('/location', async(req, respond, next) => {
    try { 
        const searchQuery = req.query.search;
        const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
   
        const locationResult = await request.get(`https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${searchQuery}&format=json`);
        
        const firstResult = locationResult.body[0];
        respond.json({
            formatted_query: firstResult.display_name,
            latitude: firstResult.lat,
            longitude: firstResult.lon
        }); 
    }
    catch (err){
        next(err);
    }
});
// weather route
app.get('/weather', async(request, respond) => {
    const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
    const weatherData = await request.get(`https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${lat},${lng}`);

    const lat = request.query.weather;
    // const lng = ;
    const weatherInfo = weatherData.daily.data[0];
    return {
        'forecast': weatherInfo.summary,
        'time': new Date(weatherInfo.time * 1000).toDateString()
    };

    // const weatherResult = getWeather(lat, lng);
    respond.json(weatherResult);

});

// need to listen to see if port running
app.listen(port, () => {
    console.log('server running', port);
});