const request = require('supertest');
const { app, server } = require('./index');

describe('GET /', () => {
    afterAll(() => {
        server.close();
    });

    // it('should return Hello World', async () => {
    //     const response = await request(app).get('/');
    //     expect(response.text).toBe('Hello World');
    // });

    it('should return text from dotenv', async () => {
        const response = await request(app).get('/');
        expect(response.text).toBe(process.env.RESPONSE_TEXT);
    });
});