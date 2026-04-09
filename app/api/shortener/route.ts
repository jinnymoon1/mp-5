import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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

        const client = await clientPromise;
        const db = client.db("url-shortener");
        const collection = db.collection("links");

        const existing = await collection.findOne({ alias });
        if (existing) {
            return NextResponse.json(
                { error: "Alias already exists" },
                { status: 400 }
            );
        }

        await collection.insertOne({ url, alias });

        return NextResponse.json({
            shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/r/${alias}`,
        });
    } catch (error) {
        console.error("POST /api/shortener failed:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}