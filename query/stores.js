import { MongoClient } from 'mongodb';

const url = 'mongodb://admin:secret@events-db:27017';
const client = new MongoClient(url);
const dbName = 'events';

let events;
const eventCollection = async () => {
  if (!events) {
    console.log(`query store mongodb event not exist: ${events}`);
    await client.connect();
    const db = client.db(dbName);
    events = db.collection('events');
  }
  return events;
};


const read = async() => {
  try{
    const collection = await eventCollection();
    const doc = await collection.find({}).toArray();
    return doc[0] || {};
  } catch(err){
    console.log(err)
  }
};

const write = async(events) => {
  try {
    const collection = await eventCollection();
    await collection.deleteMany({});
    await collection.insertOne(events);
  } catch (err) {
    console.log(err);
  }
};

export default {
  read,
  write,
};
