"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface RedirectData {
    originalUrl?: string;
    error?: string;
}

export default function RedirectPage() {
    const params = useParams();
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        async function getOriginalUrl() {
            const alias = params.alias;

            const response: Response = await fetch(
                "/api/shortener?alias=" + alias
            );

            const data: RedirectData = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || "Alias not found.");
                return;
            }

            if (data.originalUrl) {
                window.location.href = data.originalUrl;
            }
        }

        getOriginalUrl();
    }, [params]);

    return (
        <main className="pageWrapper">
            <section className="card">
                <h1 className="title">Redirecting...</h1>
                {errorMessage ? (
                    <p className="errorText">{errorMessage}</p>
                ) : (
                    <p className="description">
                        Please wait while we send you to your destination.
                    </p>
                )}
            </section>
        </main>
    );
}