const axios = require('axios');

const client = {
    async get(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = client;