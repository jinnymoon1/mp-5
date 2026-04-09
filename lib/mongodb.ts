import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is missing");
}

type MongoCache = {
    client: MongoClient | null;
    db: Db | null;
};

const globalForMongo = globalThis as typeof globalThis & {
    mongoCache?: MongoCache;
};

if (!globalForMongo.mongoCache) {
    globalForMongo.mongoCache = {
        client: null,
        db: null,
    };
}

export async function getDatabase(): Promise<Db> {
    if (globalForMongo.mongoCache.db) {
        return globalForMongo.mongoCache.db;
    }

    if (!globalForMongo.mongoCache.client) {
        globalForMongo.mongoCache.client = new MongoClient(uri);
        await globalForMongo.mongoCache.client.connect();
    }

    globalForMongo.mongoCache.db =
        globalForMongo.mongoCache.client.db("urlShortenerDB");

    return globalForMongo.mongoCache.db;
}