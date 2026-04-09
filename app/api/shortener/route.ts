import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url, alias } = body;

        if (!url || !alias) {
            return NextResponse.json(
                { error: "URL and alias are required" },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection("links");

        const existing = await collection.findOne({ alias });

        if (existing) {
            return NextResponse.json(
                { error: "Alias already exists" },
                { status: 400 }
            );
        }

        await collection.insertOne({ url, alias });

        return NextResponse.json(
            { shortUrl: `/r/${alias}` },
            { status: 200 }
        );
    } catch (error) {
        console.error("POST /api/shortener failed:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}