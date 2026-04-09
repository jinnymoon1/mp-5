import { getDatabase } from "@/lib/mongodb";

type ShortUrlDocument = {
    alias: string;
    longUrl: string;
    createdAt: Date;
};

type RequestBody = {
    longUrl?: unknown;
    alias?: unknown;
};

function isValidUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);

        if (
            parsedUrl.protocol !== "http:" &&
            parsedUrl.protocol !== "https:"
        ) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

function isValidAlias(alias: string): boolean {
    const aliasPattern = /^[a-zA-Z0-9_-]+$/;
    return aliasPattern.test(alias);
}

export async function POST(req: Request): Promise<Response> {
    try {
        const body = (await req.json()) as RequestBody;

        const longUrl =
            typeof body.longUrl === "string" ? body.longUrl.trim() : "";

        const alias =
            typeof body.alias === "string" ? body.alias.trim() : "";

        if (longUrl === "" || alias === "") {
            return Response.json(
                { error: "Both URL and alias are required." },
                { status: 400 }
            );
        }

        if (!isValidUrl(longUrl)) {
            return Response.json(
                { error: "Please enter a valid URL." },
                { status: 400 }
            );
        }

        if (!isValidAlias(alias)) {
            return Response.json(
                {
                    error:
                        "Alias may only contain letters, numbers, hyphens, and underscores.",
                },
                { status: 400 }
            );
        }

        const reservedAliases = ["api", "r"];

        if (reservedAliases.includes(alias.toLowerCase())) {
            return Response.json(
                { error: "That alias is reserved. Please choose a different alias." },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection<ShortUrlDocument>("shortUrls");

        const existingAlias = await collection.findOne({ alias: alias });

        if (existingAlias !== null) {
            return Response.json(
                { error: "That alias is already taken." },
                { status: 409 }
            );
        }

        await collection.insertOne({
            alias: alias,
            longUrl: longUrl,
            createdAt: new Date(),
        });

        const url = new URL(req.url);
        const shortUrl = `${url.origin}/r/${alias}`;

        return Response.json(
            {
                message: "Short URL created successfully.",
                shortUrl: shortUrl,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/shortener failed:", error);

        return Response.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}