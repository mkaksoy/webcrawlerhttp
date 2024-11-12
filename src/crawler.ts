"use strict";

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

export { normalizeURL, getURLsFromHTML };
