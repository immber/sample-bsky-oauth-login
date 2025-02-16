import { NodeOAuthClient } from "@atproto/oauth-client-node";
import type {
    NodeSavedSession,
    NodeSavedSessionStore,
    NodeSavedState,
    NodeSavedStateStore,
  } from '@atproto/oauth-client-node';
import { env } from './env';

const port = env.PORT;

export const newClient = (url:string) => {
   
    const host = `${url}:${port}`;

    //used in the client, should call async db funtions
    const sessionStore: NodeSavedSessionStore = {
        async set(sub: string, sessionData: NodeSavedSession){
            console.log("you need to save the session");
            console.log(sessionData);
        },
        async get(sub: string){
            console.log("you need to retrieve the session for");
            console.log(sub);
        },
        async del(sub: string){
            console.log("you need to del this session");
            console.log(sub);
        }
    }

    const stateStore: NodeSavedStateStore = {
        async set(key: string, internalState: NodeSavedState){Promise<void>},
        async get(key: string){Promise<NodeSavedState | undefined>},
        async del(key: string){Promise<void>}
    }


    return new NodeOAuthClient({

        clientMetadata: {
            client_name: 'Sample Bsky Oauth Login',
            client_id: `https://fake-something.com/client-metadata.json`,
            // client_uri: host,
            redirect_uris: [`http://127.0.0.1/oauth/callback`],
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