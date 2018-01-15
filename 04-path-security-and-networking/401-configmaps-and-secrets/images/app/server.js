'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
    for (var i = 0; i < process.env.COUNT; i++) {
        console.log("Hello world " + i);
    }
    res.send("printed " + process.env.COUNT + " times");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

