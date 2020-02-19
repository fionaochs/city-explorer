const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /location', () => {
    test('It should respond with an object with location properties',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/location');
            // check to see if the response is what we expect
            expect(response.body).toEqual({
                // it should have this name
                formatted_query: firstResult.display_name,
                latitude: firstResult.lat,
                longitude: firstResult.lng
            });
            // it should have a status of 200
            expect(response.statusCode).toBe(200);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });
});