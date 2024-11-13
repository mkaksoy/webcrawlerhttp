"use strict";

async function crawl(baseUrl: string, url: string, pages: Record<string, number>): Promise<Record<string, number>> {
  const baseUrlObj = new URL(baseUrl);
  const currentUrlObj = new URL(url);
  if (baseUrlObj.hostname !== currentUrlObj.hostname) {
    return pages;
  }

  const normalizedCurrentUrl: string = normalizeURL(url);
  if (pages[normalizedCurrentUrl] > 0) {
    pages[normalizedCurrentUrl]++;
    return pages;
  }

  pages[normalizedCurrentUrl] = 1

  console.log("Actively crawling: " + url);

  try {
    const response: Response = await fetch(url);
    const type: string | null = response.headers.get("content-type");

    if (response.status > 399) {
      console.error(
        `Failed to fetch URL: ${url}, status code: ${response.status}`
      );
      return pages;
    } else if (type && !type.includes("text/html")) {
      console.error(`Received non-HTML response: ${url}, ${type}`);
      return pages;
    }

    const body = await response.text();

    const nextURLs: string[] = getURLsFromHTML(body, baseUrl);

    for (const nextURL of nextURLs) {
      pages = await crawl(baseUrl, nextURL, pages)
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Failed to fetch URL: ${url}, error: ${err.message}`);
    } else {
      console.error(`Failed to feth URL: ${url}, error: ${String(err)}`);
    }
  }

  return pages;
}

function getURLsFromHTML(body: string, baseUrl: string): string[] {
  const urlMatches = Array.from(body.matchAll(/<a[^>]+href="([^"]+)"/g));
  const urls: string[] = [];

  for (const match of urlMatches) {
    const link = match[1];
    if (link.startsWith("/")) {
      // Relative
      try {
        const urlObj = new URL(baseUrl + link);
        urls.push(urlObj.href);
      } catch (err) {
        console.error(`Invalid relative link: ${link}, error: ${err}`);
      }
    } else if (link.startsWith("http")) {
      // Absolute
      try {
        const urlObj = new URL(link);
        urls.push(urlObj.href);
      } catch (err) {
        console.error(`Invalid absolute link: ${link}, error: ${err}`);
      }
    }
  }

  return urls;
}

function normalizeURL(url: string): string {
  const urlObj: URL = new URL(url);
  const path: string = (urlObj.host + urlObj.pathname).toLowerCase();

  if (path.length > 0 && path.slice(-1) === "/") {
    return path.slice(0, -1);
  } else {
    return path;
  }
}

export { normalizeURL, getURLsFromHTML, crawl };
