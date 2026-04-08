import clientPromise from "./mongodb";

type ShortLink = {
    alias: string;
    originalUrl: string;
    createdAt: string;
};

export async function findShortLinkByAlias(alias: string): Promise<ShortLink | null> {
    const client = await clientPromise;
    const db = client.db("url-shortener");
    const collection: any = db.collection("shortLinks");

    const results: any[] = await collection.find({ alias: alias }).toArray();

    if (results.length === 0) {
        return null;
    }

    return {
        alias: results[0].alias,
        originalUrl: results[0].originalUrl,
        createdAt: results[0].createdAt,
    };
}

export async function createShortLink(
    alias: string,
    originalUrl: string
): Promise<ShortLink> {
    const client = await clientPromise;
    const db = client.db("url-shortener");
    const collection: any = db.collection("shortLinks");

    const shortLink: ShortLink = {
        alias: alias,
        originalUrl: originalUrl,
        createdAt: new Date().toISOString(),
    };

    await collection.insertOne(shortLink);

    return shortLink;
}