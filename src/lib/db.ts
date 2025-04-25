import { MongoClient, MongoServerError } from 'mongodb';
import type {
    NodeSavedSession,
    NodeSavedSessionStore,
    NodeSavedState,
    NodeSavedStateStore,
  } from '@atproto/oauth-client-node';
import { CookieStore } from "./cookies"

export class StateStore implements NodeSavedStateStore {
    constructor(private store: CookieStore) {}
    async get(key: string): Promise<NodeSavedState | undefined> {
        // console.log('getting state');
        const result = await this.store.retreiveStateCookie(key)
        if (!result) return
        return result as NodeSavedState
    }
    async set(key: string, state: NodeSavedState) {
        // console.log('setting state')
        await this.store.setStateCookie(key, state);
    }
    async del(key: string) {
        // console.log('deleting state')
        await this.store.deleteCookie(key);
    }
}
  
export class SessionStore implements NodeSavedSessionStore {
    constructor(private db: MongoClient) {}
    async get(key: string): Promise<NodeSavedSession | undefined> {
        // console.log('getting session')
        const authSessions = await this.db.db().collection('AuthSessions');
        const result = await authSessions.findOne({key: key});
        if (!result) return
        // console.log('returning session ' + result.session)
        return result.session as NodeSavedSession
    }
    async set(key: string, session: NodeSavedSession) {
        // console.log('setting session')
        const authSessions = await this.db.db().collection('AuthSessions');
        await authSessions.insertOne({key: key, session: session});
    }
    async del(key: string) {
        // console.log('deleting session')
        const authSessions = await this.db.db().collection('AuthSessions');
        await authSessions.deleteOne({key: key});
    }
}
