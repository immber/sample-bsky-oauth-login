## An atproto oAuth login sample app

This sample app was constructed based on the [Statusphere](https://github.com/bluesky-social/statusphere-example-app/) example app, but this one ONLY does *oauth*. 


### Local Deps 
* An `Express` app written in `Typescript`
* Developed for `Node v18.16.0` to demo the use of [`@atproto/oauth-client-node`](https://www.npmjs.com/package/@atproto/oauth-client-node)
* You can choose `pnpm` or `npm` to run this sample locally. It was originally started with npm, and then pnpm was added later. 
* Uses `mongo` to store `session` and `cookies` to store state during auth flow

### Annoyingly verbose
There are about a zillion commented out `console.logs` for assistance with debugging, and visualizing the auth flow in your terminal. 

### Additional Resources
* This is the sample app I mentioned in the gist for my 2025 ATmosphere Lightening Talk ["Tales of Adding oAuth "Login with Bluesky" to an OS Comments Tool"](https://gist.github.com/immber/dd118b97fa3c210bcf89b9e8920883a0#stage-6-a-sample-app-working-locally). 
* For `Bun` users, or anyone hitting `can not resolve handle` due to `fetch` errors, see https://github.com/bluesky-social/atproto/issues/3488 and https://github.com/bluesky-social/atproto/issues/3488

## TODO
* It only works 1 time because there is no session refresh or lock, manually delete the session record from the DB to run thru the authorization flow again. 