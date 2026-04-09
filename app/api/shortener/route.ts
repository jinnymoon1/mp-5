import { getShortUrlsCollection } from "@/lib/mongodb";

type RequestBody = {
    longUrl?: string;
    alias?: string;
};

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
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
        const body: RequestBody = await req.json();

        const longUrl = body.longUrl ? body.longUrl.trim() : "";
        const alias = body.alias ? body.alias.trim() : "";

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
                { error: "Alias may only contain letters, numbers, hyphens, and underscores." },
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

        const collection = await getShortUrlsCollection();

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

        const origin = req.headers.get("origin") || "";
        const shortUrl = `${origin}/r/${alias}`;

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