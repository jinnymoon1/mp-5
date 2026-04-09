import { MongoClient, Db, Collection } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(uri);

let database: Db | null = null;

export async function getDatabase(): Promise<Db> {
    if (database !== null) {
        return database;
    }

    await client.connect();
    database = client.db("urlShortenerDB");
    return database;
}

export async function getShortUrlsCollection(): Promise<Collection> {
    const db = await getDatabase();
    return db.collection("shortUrls");
}