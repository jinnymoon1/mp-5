import { redirect, notFound } from "next/navigation";
import { getShortUrlsCollection } from "@/lib/mongodb";

type PageProps = {
    params: Promise<{
        alias: string;
    }>;
};

export default async function AliasRedirectPage({ params }: PageProps) {
    const resolvedParams = await params;
    const alias = resolvedParams.alias;

    const collection = await getShortUrlsCollection();
    const record = await collection.findOne({ alias: alias });

    if (record === null) {
        notFound();
    }

    redirect(record.longUrl);
}