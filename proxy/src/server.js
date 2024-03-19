const express = require('express');
const routes = require('./routes');
const config = require('../index');

const app = express();
const port = config.get('port');

app.use('/', routes);

app.listen(port, () => {
    console.log(`Proxy server is running on port ${port}`);
});