const express = require('express');

const app = express();

// serve files from the public directory
app.use(express.static('public'));

// allow urlencoded payloads
app.use(express.urlencoded({ extended: false }));

// start the express web server listening on 8080
app.listen(8080, () => {
  console.log('listening on 8080');
});

// handle login btn click
app.post('/login', (req, res) => {
    console.log('Add oauth to bsky')
    const handle = req.body.handle;
    console.log(handle);
    res.sendStatus(200);
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
