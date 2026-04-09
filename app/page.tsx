"use client";

import { useState } from "react";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setShortUrl("");

    try {
      const res = await fetch("/api/shortener", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl: longUrl,
          alias: alias,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong while creating the short URL.");
        return;
      }

      setShortUrl(data.shortUrl);
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  }

  return (
      <main style={{ padding: "2rem" }}>
        <h1>URL Shortener</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Long URL: </label>
            <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Enter full URL"
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Alias: </label>
            <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Enter custom alias"
            />
          </div>

          <button type="submit">Shorten URL</button>
        </form>

        {shortUrl && (
            <p style={{ marginTop: "1rem" }}>
              Short URL: <a href={shortUrl}>{shortUrl}</a>
            </p>
        )}

        {error && (
            <p style={{ marginTop: "1rem", color: "red" }}>
              {error}
            </p>
        )}
      </main>
  );
}