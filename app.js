const express = require('express');
// Application Dependencies

const cors = require('cors');
require('dotenv').config();

const app = express();
// get the port on which to run the server
app.use(cors());

const request = require('superagent');
const port = process.env.PORT || 3000;

let lat;
let lng;

app.get('/location', async(req, response, next) => {
    try {
        const searchQuery = req.query.search;
        const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
    
        const locationResult = await request.get(`https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${searchQuery}&format=json`);
    
        const firstResult = locationResult.body[0];
  
         // update the global state of lat and lng so it is accessbile in other routes
        lat = firstResult.lat;
        lng = firstResult.lon;

        response.json({
            formatted_query: firstResult.display_name,
            latitude: lat,
            longitude: lng
        });
    }
    catch (err){
        next(err);
    }
});
// function toLocation(req) {
//     const searchQuery = req.query.search;
//     const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

//     const locationResult = request.get(`https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${searchQuery}&format=json`);

//     const firstResult = locationResult.body[0];

//      // update the global state of lat and lng so it is accessbile in other routes
//     lat = firstResult.lat;
//     lng = firstResult.lon;
//     return {
//         formatted_query: firstResult.display_name,
//         latitude: lat,
//         longitude: lng
//     };
// }

app.get('/weather', async(req, response, next) => {
    try { 
        const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
        const weatherData = await request.get(`https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${lat},${lng}`);

        const weatherInfo = weatherData.daily.data[0];
        response.json({ 
            'forecast': weatherInfo.summary,
            'time': new Date(weatherInfo.time * 1000).toDateString()
        });
    }
    catch (err){
        next(err);
    }
});

// const getWeatherData = async(lat, lng) => {
//     const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
//     const weatherData = await request.get(`https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${lat},${lng}`);

//     const weatherInfo = weatherData.daily.data[0];
//     return { 
//         'forecast': weatherInfo.summary,
//         'time': new Date(weatherInfo.time * 1000).toDateString()
//     };
// };


app.get('/yelp', async(req, response, next) => {
    try { 
        const YELP_API_KEY = process.env.YELP_API_KEY;
        const yelpData = await request
            .get(`https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lng}`)
            .set('Authorization', `Bearer ${YELP_API_KEY}`);

        const yelpInfo = yelpData.body;
        const yelpBusinesses = yelpInfo.businesses.map(business => {
            return {
                'name': business.name,
                'image_url': business.image_url,
                'price': business.price,
                'rating': business.rating,
                'url': business.url
            };
        });
        response.json(yelpBusinesses);
    }
    catch (err){
        next(err);
    }
});

// app.get('/event', async(req, response, next) => {
//     try {
//         const EVENTFUL_API_KEY = process.env.EVENTFUL_API_KEY;
//         const eventfulData = await request.get(`http://api.eventful.com/rest/events/search?...&${lat},${lng}&within=25`);
//         const eventData = eventfulData. 
//         const events = eventData.map(event => {
//             return {
//                 "link": event.link,
//                 "name": event.name,
//                 "event_date": event.event_date,
//                 "summary": event.summary
//               }
//         });
//         response.json(events);

//     }
//     catch (err){
//         next(err);
//     }
// });

app.get('/trails', async(req, response, next) => {
    try {
        const HIKING_API_KEY = process.env.HIKING_API_KEY;
        const hikingData = await request.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&maxDistance=10&key=${HIKING_API_KEY}`);
        const hikeData = hikingData.body;
        const hikes = hikeData.trails.map(hike => {
            return {
                'name': hike.name,
                'location': hike.location,
                'length': hike.length,
                'stars': hike.stars,
                'star_votes': hike.star_votes,
                'summary': hike.summary,
                'trail_url': hike.trail_url,
                'conditions': hike.conditions,
                'condition_date': hike.condition_date,
                'condition_time': hike.condition_time
            };
        });
        response.json(hikes);

    }
    catch (err){
        next(err);
    }
});



// need to listen to see if port running
app.listen(port, () => {
    console.log('server running', port);
});