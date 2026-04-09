import { MongoClient, Db } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
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
    const cache = globalForMongo.mongoCache;

    if (!cache) {
        throw new Error("Mongo cache was not initialized.");
    }

    if (cache.db !== null) {
        return cache.db;
    }

    if (cache.client === null) {
        cache.client = new MongoClient(mongoUri);
        await cache.client.connect();
    }

    cache.db = cache.client.db("urlShortenerDB");

    return cache.db;
}