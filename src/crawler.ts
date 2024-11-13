"use strict";

async function crawl(url: string) {
  console.log("Actively crawling: " + url);

  try {
    const response: Response = await fetch(url);
    const type: string | null = response.headers.get("content-type");

    if (response.status > 399) {
      console.error(
        `Failed to fetch URL: ${url}, status code: ${response.status}`
      );
      return;
    } else if (type && !type.includes("text/html")) {
      console.error(`Received non-HTML response: ${url}, ${type}`);
      return;
    }

    console.log(await response.text());
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Failed to fetch URL: ${url}, error: ${err.message}`);
    } else {
      console.error(`Failed to feth URL: ${url}, error: ${String(err)}`);
    }
  }
}

function getURLsFromHTML(body: string, baseUrl: string): string[] {
  const urlMatches: RegExpExecArray[] = Array.from(
    body.matchAll(/href="([^"]+)"/g)
  );
  const links: string[] = Array.from(urlMatches, (match) => match[1]);
  const urls: string[] = [];

  for (const link of links) {
    if (link.slice(0, 1) === "/") {
      // Relative links
      try {
        const urlObj: URL = new URL(baseUrl + link);
        urls.push(urlObj.href);
      } catch (err) {
        console.error(`Invalid relative link: ${link}, error: ${err}`);
      }
    } else {
      // Absolute links
      try {
        const urlObj: URL = new URL(link);
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
