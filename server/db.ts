import { Collection, MongoClient } from 'mongodb';

const dbUrl = 'mongodb://root:example@localhost:27017';
export const mongoClient = new MongoClient(dbUrl);

export async function connect(): Promise<MongoClient> {
    return mongoClient.connect();
}
