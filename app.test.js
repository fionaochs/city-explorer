const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /location', () => {
    test('Test location API response',
        async(done) => {
            const response = await request(app)
                .get('/location?search=portland')
                .expect('Content-Type', /json/);
           
            expect(response.body).toEqual({
                formatted_query: 'Portland, Multnomah County, Oregon, USA', 
                latitude: '45.5202471', 
                longitude: '-122.6741949'
            });
            expect(response.statusCode).toBe(200);
            done();
        });
});