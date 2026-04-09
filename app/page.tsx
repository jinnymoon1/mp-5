"use client";

import { useState } from "react";

type ApiResponse = {
  message?: string;
  error?: string;
  shortUrl?: string;
};

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [message, setMessage] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setShortUrl("");

    try {
      const response = await fetch("/api/shortener", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl: longUrl,
          alias: alias,
        }),
      });

      const data: ApiResponse = await response.json();

      if (response.status >= 400) {
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setMessage(data.message || "Success.");
      setShortUrl(data.shortUrl || "");
      setLongUrl("");
      setAlias("");
    } catch (error) {
      setMessage("Could not connect to the server.");
    }
  }

  async function copyShortUrl() {
    if (shortUrl === "") {
      return;
    }

    try {
      await navigator.clipboard.writeText(shortUrl);
      setMessage("Short URL copied to clipboard.");
    } catch (error) {
      setMessage("Could not copy the short URL.");
    }
  }

  return (
      <main className="page">
        <section className="card">
          <h1>URL Shortener</h1>
          <p className="subtitle">
            Enter a URL and choose your own alias.
          </p>

          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label htmlFor="longUrl">URL</label>
              <input
                  id="longUrl"
                  type="text"
                  value={longUrl}
                  onChange={(event) => setLongUrl(event.target.value)}
                  placeholder="https://example.com"
              />
            </div>

            <div className="field">
              <label htmlFor="alias">Alias</label>
              <input
                  id="alias"
                  type="text"
                  value={alias}
                  onChange={(event) => setAlias(event.target.value)}
                  placeholder="my-link"
              />
            </div>

            <button type="submit">Create Short URL</button>
          </form>

          {message !== "" && <p className="message">{message}</p>}

          {shortUrl !== "" && (
              <div className="result">
                <p>Your shortened URL:</p>
                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
                <button type="button" onClick={copyShortUrl}>
                  Copy
                </button>
              </div>
          )}
        </section>
      </main>
  );
}