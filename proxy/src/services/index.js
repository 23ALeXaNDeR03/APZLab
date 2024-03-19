const client = require('../client');
const config = require('../../index');

const service = {
    async getData() {
        const apiUrl = config.get('apiUrl');
        const data = await client.get(apiUrl);
        return data;
    }
};

module.exports = service;