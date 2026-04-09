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
        setError(data.error || "Something went wrong.");
        return;
      }

      setShortUrl(data.shortUrl);
      setLongUrl("");
      setAlias("");
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  }

  return (
      <main className="page-wrapper">
        <section className="card">
          <h1 className="title">URL Shortener</h1>
          <p className="subtitle">Create a shorter and easier link.</p>

          <form onSubmit={handleSubmit} className="shortener-form">
            <label htmlFor="longUrl" className="form-label">
              Long URL
            </label>
            <input
                id="longUrl"
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com"
                className="form-input"
            />

            <label htmlFor="alias" className="form-label">
              Custom Alias
            </label>
            <input
                id="alias"
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="my-link"
                className="form-input"
            />

            <button type="submit" className="submit-button">
              Shorten URL
            </button>
          </form>

          {shortUrl ? (
              <div className="success-box">
                <p className="result-label">Short URL created:</p>
                <a href={shortUrl} className="result-link">
                  {shortUrl}
                </a>
              </div>
          ) : null}

          {error ? <p className="error-box">{error}</p> : null}
        </section>
      </main>
  );
}