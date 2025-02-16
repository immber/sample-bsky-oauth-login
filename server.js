import express from 'express';
// import { client } from './oauth.ts';
import next from 'next';


const app = express();

// serve files from the public directory
app.use(express.static('public'));

// allow urlencoded payloads
app.use(express.urlencoded({ extended: false }));

// start the express web server listening on 8080
app.listen(8080, () => {
  console.log('listening on 8080');
});

//expost endpoints for oauth metadata & jwks
app.get('client-metadata.json', (req, res) => res.json(client.clientMetadata))
app.get('jwks.json', (req, res) => res.json(client.jwks))

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
      next(err)
    }
  })


// handle login btn click
app.post('/login', async (req, res) => {
    console.log('Attempting login to bsky for user:')
    const handle = req.body.handle;
    console.log(handle);
    const state = '434321' //wtf is this random ass string???

    try {
        const ac = new AbortController();
        req.on('close', () => ac.abort())

        console.log('trying client.authorize req');
        const url = await client.authorize(handle, {
            signal: ac.signal,
            state
        })
        res.redirect(url);
    } catch (err) {
        next(err);
    }
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
