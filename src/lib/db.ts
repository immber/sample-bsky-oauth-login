import { MongoClient, MongoServerError } from 'mongodb';
import type {
    NodeSavedSession,
    NodeSavedSessionStore,
    NodeSavedState,
    NodeSavedStateStore,
  } from '@atproto/oauth-client-node';

export class StateStore implements NodeSavedStateStore {
    constructor(private db: MongoClient) {}
    async get(key: string): Promise<NodeSavedState | undefined> {
        // console.log('getting state')
        const authStates = await this.db.db().collection('AuthStates');
        const result = await authStates.findOne({key: key});
        if (!result) return
        console.log('returning state');
        return result.state as NodeSavedState
    }
    async set(key: string, state: NodeSavedState) {
        // console.log('setting state')
        const authStates = await this.db.db().collection('AuthStates');
        await authStates.insertOne({key: key, state: state});
    }
    async del(key: string) {
        // console.log('deleting state')
        const authStates = await this.db.db().collection('AuthStates');
        await authStates.deleteOne({key: key});
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


//test function to ensure connection to db is good to go
export async function saveClicks(client: MongoClient, click:any){
    const coll = await client.db().collection('clicks');

    try {
      await coll.insertOne({click});
    } catch (err) {
      if (err instanceof MongoServerError) {
        console.log(err);
      }
      throw err;
    };

}