import { Collection, MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

// example of dbUrl: mongodb://user:password@localhost:27017
const dbUrl = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;

export const mongoClient = new MongoClient(dbUrl);

export async function connect(): Promise<MongoClient> {
    return mongoClient.connect();
}

export async function disconnect() {
    return mongoClient.close();
}
