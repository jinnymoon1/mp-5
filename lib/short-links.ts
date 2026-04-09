import { getDatabase } from "./mongodb";

export type ShortLink = {
    alias: string;
    longUrl: string;
    createdAt: Date;
};

export async function getShortLinkByAlias(
    alias: string
): Promise<ShortLink | null> {
    const db = await getDatabase();
    const collection = db.collection<ShortLink>("shortUrls");

    const result = await collection.findOne({ alias: alias });

    if (result === null) {
        return null;
    }

    return {
        alias: result.alias,
        longUrl: result.longUrl,
        createdAt: result.createdAt,
    };
}

export async function createShortLink(
    alias: string,
    longUrl: string
): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection<ShortLink>("shortUrls");

    await collection.insertOne({
        alias: alias,
        longUrl: longUrl,
        createdAt: new Date(),
    });
}