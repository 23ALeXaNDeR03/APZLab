// const convict = require('convict');

// const config = convict({
//     env: {
//         doc: 'The application environment',
//         format: ['production', 'development', 'test'],
//         default: 'development',
//         env: 'NODE_ENV'
//     },
//     apiUrl: {
//         doc: 'The URL of the API application',
//         format: String,
//         default: 'http://localhost:3000',
//         env: 'API_URL'
//     },
//     port: {
//         doc: 'The port on which the proxy server will listen',
//         format: 'port',
//         default: 3001,
//         env: 'PORT'
//     }
// });

// const env = config.get('env');
// config.loadFile(`./config.${env}.json`);

// const apiUrl = config.get('apiUrl');
// const port = config.get('port');

// const express = require('express');
// const axios = require('axios');
// const app = express();

// app.get('/', async (req, res) => {
//     try {
//         // const response = await axios.get('http://localhost:3000');
//         const response = await axios.get(apiUrl);
//         res.send(response.data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred');
//     }
// });

// app.listen(port, () => {
//     console.log(`Proxy server is running on port ${port}`);
// });
const convict = require('convict');

const config = convict({
    env: {
        doc: 'The application environment',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    apiUrl: {
        doc: 'The URL of the API application',
        format: String,
        default: 'http://localhost:3000',
        env: 'API_URL'
    },
    port: {
        doc: 'The port on which the proxy server will listen',
        format: 'port',
        default: 3001,
        env: 'PORT'
    }
});

const env = config.get('env');
config.loadFile(`./config.${env}.json`);

module.exports = config;