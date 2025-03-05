import { MongoClient } from 'mongodb';
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { StateStore, SessionStore } from './db';
import { env } from './env';


const port = env.PORT;
const enc = encodeURIComponent

export const newClient = (db:MongoClient) => {
   //try resetting the url instead of using the one passed in
    const hostURL = env.PUBLIC_URL || `http://127.0.0.1:${port}`
    console.log(`new client created url is: ${hostURL}`)
    //used in the client, should call async db funtions
    const sessionStore = new SessionStore(db);
    const stateStore = new StateStore(db);

    return new NodeOAuthClient({

        clientMetadata: {
            client_name: 'SampleBskyOauthLogin',
            client_id: `http://localhost?redirect_uri=${enc(`${hostURL}/oauth/callback`)}&scope=${enc('atproto transition:generic')}`,
            client_uri: hostURL,
            redirect_uris: [`${hostURL}/oauth/callback`],
            scope: 'atproto transition:generic',
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            application_type: 'web',
            token_endpoint_auth_method: 'none',
            // token_endpoint_auth_method: 'private_key_jwt',
            dpop_bound_access_tokens: true,
            // jwks_uri: `${localhost}/jwks.json`
        },
        stateStore:     stateStore,
        sessionStore:   sessionStore
    })
}