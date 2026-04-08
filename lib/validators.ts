export function isValidUrl(url: string): boolean {
    try {
        const parsedUrl: URL = new URL(url);

        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

export function isValidAlias(alias: string): boolean {
    const aliasPattern: RegExp = /^[a-zA-Z0-9_-]+$/;
    return aliasPattern.test(alias);
}