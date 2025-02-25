import { MongoClient, MongoServerError } from 'mongodb';

// const Users = await mongoClient.db().collection('users');


//test function to ensure connection to db is good to go
export async function saveClicks(client: MongoClient, click){
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