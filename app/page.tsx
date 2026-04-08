"use client";

import { FormEvent, useState } from "react";

interface ApiResponse {
  error?: string;
  alias?: string;
}

export default function Home() {
  const [alias, setAlias] = useState<string>("");
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(
      event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setShortUrl("");
    setIsLoading(true);

    try {
      const response: Response = await fetch("/api/shortener", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alias: alias,
          originalUrl: originalUrl,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Something went wrong.");
        setIsLoading(false);
        return;
      }

      const generatedShortUrl: string =
          window.location.origin + "/r/" + data.alias;

      setSuccessMessage("Short URL created successfully.");
      setShortUrl(generatedShortUrl);
      setAlias("");
      setOriginalUrl("");
      setIsLoading(false);
    } catch {
      setErrorMessage("Something went wrong.");
      setIsLoading(false);
    }
  }

  return (
      <main className="pageWrapper">
        <section className="card">
          <p className="badge">CS391 Mini Project</p>
          <h1 className="title">URL Shortener</h1>
          <p className="description">
            Enter a long URL and a custom alias. Then share the short link.
          </p>

          <form className="form" onSubmit={handleSubmit}>
            <div className="fieldGroup">
              <label className="label" htmlFor="originalUrl">
                Original URL
              </label>
              <input
                  id="originalUrl"
                  className="input"
                  type="text"
                  placeholder="https://example.com/page"
                  value={originalUrl}
                  onChange={(event) => setOriginalUrl(event.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label className="label" htmlFor="alias">
                Alias
              </label>
              <input
                  id="alias"
                  className="input"
                  type="text"
                  placeholder="my-link"
                  value={alias}
                  onChange={(event) => setAlias(event.target.value)}
              />
            </div>

            <button className="button" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Short URL"}
            </button>
          </form>

          {errorMessage ? <p className="errorText">{errorMessage}</p> : null}
          {successMessage ? <p className="successText">{successMessage}</p> : null}

          {shortUrl ? (
              <section className="resultBox">
                <p className="resultLabel">Your shortened URL</p>
                <p className="resultUrl">{shortUrl}</p>
              </section>
          ) : null}
        </section>
      </main>
  );
}