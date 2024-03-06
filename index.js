const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config()

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    // res.send('Hello World');
    res.send(process.env.RESPONSE_TEXT);
});

module.exports = { app, server };