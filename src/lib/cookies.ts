"use strict";
const cookie = require("cookie");
import { Request, Response } from "express";
import type {
    NodeSavedState,
  } from '@atproto/oauth-client-node';



export class CookieStore {
    req: Request | undefined;
    res: Response | undefined;
    
    attach(req:Request, res:Response) {
        this.req = req;
        this.res = res;
    }
    
    async setStateCookie(key:string, state:NodeSavedState) {
        const data = JSON.stringify(state);
        this.res?.cookie(key, data);
    }

    async retreiveStateCookie(key:string) {
        const header = this.req?.headers.cookie;
        
        if (typeof header === "string") {
            const cookies = cookie.parse(header);
            const stateCookie = cookies[key];
            if (!stateCookie || typeof stateCookie !== "string") {
                throw new Error("no atproto cookie found");
            }
            if (stateCookie) {
              return JSON.parse(stateCookie.valueOf());
            }
          }
          throw new Error("missing state cookie");
    }

    async deleteCookie(key:string) {
        this.res?.clearCookie(key);
    }
}