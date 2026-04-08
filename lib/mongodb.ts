import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI || "";

if (uri === "") {
    throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(uri);
const clientPromise = client.connect();

export default clientPromise;