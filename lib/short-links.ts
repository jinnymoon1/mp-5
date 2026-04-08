import { getShortLinksCollection } from "@/lib/db";

export interface ShortLink {
    alias: string;
    originalUrl: string;
    createdAt: Date;
}

export async function findShortLinkByAlias(
    alias: string
): Promise<ShortLink | null> {
    const collection = await getShortLinksCollection();

    const results = await collection.find({ alias: alias }).toArray();

    if (results.length === 0) {
        return null;
    }

    return results[0] as ShortLink;
}

export async function createShortLink(
    alias: string,
    originalUrl: string
): Promise<void> {
    const collection = await getShortLinksCollection();

    await collection.insertOne({
        alias: alias,
        originalUrl: originalUrl,
        createdAt: new Date(),
    });
}