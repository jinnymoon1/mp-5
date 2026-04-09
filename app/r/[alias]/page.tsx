import { notFound, redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";

type ShortUrlDocument = {
    alias: string;
    longUrl: string;
    createdAt: Date;
};

type PageProps = {
    params: Promise<{
        alias: string;
    }>;
};

export default async function AliasPage({
                                            params,
                                        }: PageProps): Promise<never> {
    const resolvedParams = await params;
    const alias = resolvedParams.alias;

    const db = await getDatabase();
    const collection = db.collection<ShortUrlDocument>("shortUrls");

    const result = await collection.findOne({ alias: alias });

    if (result === null) {
        notFound();
    }

    return redirect(result.longUrl);
}