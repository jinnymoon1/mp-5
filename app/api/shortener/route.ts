import { createShortLink, findShortLinkByAlias } from "@/lib/short-links";
import { isValidAlias, isValidUrl } from "@/lib/validators";

export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const alias: string = searchParams.get("alias") || "";

    if (!alias) {
        return new Response(
            JSON.stringify({ error: "Alias is required." }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    const shortLink = await findShortLinkByAlias(alias);

    if (!shortLink) {
        return new Response(
            JSON.stringify({ error: "Alias not found." }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return new Response(
        JSON.stringify({
            alias: shortLink.alias,
            originalUrl: shortLink.originalUrl,
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json();

        const alias: string = (body.alias || "").trim();
        const originalUrl: string = (body.originalUrl || "").trim();

        if (!alias || !originalUrl) {
            return new Response(
                JSON.stringify({ error: "Alias and URL are required." }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!isValidAlias(alias)) {
            return new Response(
                JSON.stringify({
                    error:
                        "Alias can only contain letters, numbers, underscores, and hyphens.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!isValidUrl(originalUrl)) {
            return new Response(
                JSON.stringify({
                    error: "Please enter a valid URL starting with http:// or https://",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const existingShortLink = await findShortLinkByAlias(alias);

        if (existingShortLink) {
            return new Response(
                JSON.stringify({ error: "That alias is already taken." }),
                {
                    status: 409,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        await createShortLink(alias, originalUrl);

        return new Response(
            JSON.stringify({
                alias: alias,
            }),
            {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch {
        return new Response(
            JSON.stringify({
                error: "Something went wrong while creating the short URL.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}