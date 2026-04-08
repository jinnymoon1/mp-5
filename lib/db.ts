import { MongoClient } from "mongodb";

const MONGODB_URI: string = process.env.MONGODB_URI || "";
const MONGODB_DB_NAME: string = process.env.MONGODB_DB_NAME || "";

if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in .env.local");
}

if (!MONGODB_DB_NAME) {
    throw new Error("Missing MONGODB_DB_NAME in .env.local");
}

export async function getShortLinksCollection() {
    const client: MongoClient = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(MONGODB_DB_NAME);
    const collection = db.collection("short_links");

    return collection;
}