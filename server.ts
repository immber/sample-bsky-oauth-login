import express from 'express';
import { env } from './src/lib/env';
import { newClient } from './src/lib/oauth';
import { Agent } from '@atproto/api';
import { MongoClient, MongoServerError } from 'mongodb';
import { saveClicks } from './src/lib/db';



// import next from 'next'; //??


const port = env.PORT;
const url = env.PUBLIC_URL ? env.PUBLIC_URL : `http://localhost`;
const connString = env.MONGO_CONN_STRING;

const client = newClient(url);
// console.log(client.clientMetadata);

const app = express();


// serve files from the public directory
app.use(express.static('./src/public'));

// allow urlencoded payloads
app.use(express.urlencoded({ extended: false }));

const mongoClient = await new MongoClient(connString).connect();

// start the express web server listening on 8080 only if connected to db
app.listen(port, () => {
  console.log(`listening on ${port}`);
});


//expost endpoints for oauth metadata & jwks
app.get('/client-metadata.json', (req, res) => res.json(client.clientMetadata))
// app.get('/jwks.json', (req, res) => res.json(client.jwks))

// Create an endpoint to handle the OAuth callback
app.get('/oauth/callback', async (req, res, next) => {
    try {
      const params = new URLSearchParams(req.url.split('?')[1])
  
      const { session, state } = await client.callback(params)
  
      // Process successful authentication here
      console.log('authorize() was called with state:', state)
  
      console.log('User authenticated as:', session.did)
  
      const agent = new Agent(session)
  
      // Make Authenticated API calls
      const profile = await agent.getProfile({ actor: agent.did })
      console.log('Bsky profile:', profile.data)
  
      res.json({ ok: true })
    } catch (err) {
      // next(err)
    }
  })


// handle login btn click
app.post('/login', async (req, res) => {
    console.log('login to bsky for user:')
    const handle = req.body.handle;
    console.log(handle);
    const state = '434321' //wtf is this random ass string???
    const click = {clickTime: new Date()};
    console.log(click);
    console.log('do a things w/ db');
    try {
      await saveClicks(mongoClient, click);
    } catch (err) {
      if (err instanceof MongoServerError) {
        console.log(err);
      }
      throw err;
    };
    // try {
    //     const ac = new AbortController();
    //     req.on('close', () => ac.abort())

    //     console.log('trying client.authorize req');
    //     const url = await client.authorize(handle, {
    //         signal: ac.signal,
    //         state
    //     })
    //     res.redirect(url.toString());
    // } catch (err) {
    //     // next(err);
    // }
    res.sendStatus(201);
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
