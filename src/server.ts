import express from 'express';
import { env } from './lib/env';
import { newClient } from './lib/oauth';
import { Agent } from '@atproto/api';
import { MongoClient, MongoServerError } from 'mongodb';
import { isValidHandle } from '@atproto/syntax';



const port = env.PORT;
const connString = env.MONGO_CONN_STRING;

const run = async ()=> {
  const app = express();

// serve files from the public directory
app.use(express.static('./src/public'));

// allow urlencoded payloads
app.use(express.urlencoded({ extended: false }));

const mongoClient = await new MongoClient(connString).connect();
// console.log(client.clientMetadata);

// start the express web server listening on PORT 
app.listen(port, () => {
  console.log(`listening on ${port}`);
});


//expost endpoints for oauth metadata & jwks
app.get('/client-metadata.json', (req, res) => { 
  const authenticator = newClient(mongoClient);
  return res.json(authenticator.client.clientMetadata)
});
// app.get('/jwks.json', (req, res) => res.json(client.jwks))

// Create an endpoint to handle the OAuth callback
app.get('/oauth/callback', async (req, res) => {
  console.log('in /oauth/callback');
    try {
      const params = new URLSearchParams(req.url.split('?')[1])
      // console.log(params)
      const authenticator = newClient(mongoClient);
      authenticator.cookieStore.attach(req, res);
      const { session } = await authenticator.client.callback(params);
  
      // Process successful authentication here
      // console.log('authorize() was called with state:', state)
  
      // console.log('User authenticated as:', session.did)
  
      const agent = new Agent(session);
      // console.log(agent)
  
      // Make Authenticated API calls
      const profile = await agent.getProfile({ actor: agent.did ?? '' });
      // console.log('Bsky profile:', profile.data)
  
      return res.send("success");
    } catch (err) {
      console.log(err);
      return res.send('an error occured')
    }
  })


// handle login btn click
app.post('/login', async (req, res) => {
    // console.log('login to bsky for user:')
    const handle = req.body?.handle;
    if (typeof handle !== 'string' || !isValidHandle(handle)) {
      // console.log(`${handle} is not a valid handle`)
      return res.send(`${handle} is not a valid handle`);
    } 
    // console.log(handle);
    try {
        // console.log('trying client.authorize req');
        const authenticator = newClient(mongoClient);
        authenticator.cookieStore.attach(req, res);
        const loginUrl = await authenticator.client.authorize(handle, {
          scope: 'atproto transition:generic',
        })
        // console.log(loginUrl.toString());
        return res.redirect(loginUrl.toString());
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.send(err.toString());
      } else {
        return res.send(err);
      }
    
    }
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

}

run();

