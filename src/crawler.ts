"use strict";

import {
  CrawlOptions,
  PagesRecord,
  GetURLsFromHTMLOptions,
  NormalizeURLOptions,
} from "../types/crawler.types.ts";

const crawl = async ({
  baseUrl,
  url,
  pages,
}: CrawlOptions): Promise<PagesRecord> => {
  const baseUrlObj = new URL(baseUrl);
  const currentUrlObj = new URL(url);

  if (baseUrlObj.hostname !== currentUrlObj.hostname) {
    return pages;
  }

  const normalizedCurrentUrl: string = normalizeURL({ url });
  if (pages[normalizedCurrentUrl] > 0) {
    pages[normalizedCurrentUrl]++;
    return pages;
  }

  pages[normalizedCurrentUrl] = 1;
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
    const nextURLs: string[] = getURLsFromHTML({ body, baseUrl });

    for (const nextURL of nextURLs) {
      pages = await crawl({ baseUrl, url: nextURL, pages });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Failed to fetch URL: ${url}, error: ${err.message}`);
    } else {
      console.error(`Failed to fetch URL: ${url}, error: ${String(err)}`);
    }
  }

  return pages;
};

const getURLsFromHTML = ({
  body,
  baseUrl,
}: GetURLsFromHTMLOptions): string[] => {
  const urlMatches = Array.from(body.matchAll(/<a[^>]+href="([^"]+)"/g));
  const urls: string[] = [];

  for (const match of urlMatches) {
    const link = match[1];
    const isRelativeLink = link.startsWith("/");
    const isAbsoluteLink = link.startsWith("http");

    if (isRelativeLink || isAbsoluteLink) {
      try {
        const url = isRelativeLink ? new URL(baseUrl + link) : new URL(link);
        urls.push(url.href);
      } catch (err) {
        const errorMessage = isRelativeLink
          ? `Invalid relative link: ${link}`
          : `Invalid absolute link: ${link}`;
        console.error(`${errorMessage}, error: ${err}`);
      }
    }
  }

  return urls;
};

const normalizeURL = ({ url }: NormalizeURLOptions): string => {
  const urlObj: URL = new URL(url);
  const path: string = (urlObj.host + urlObj.pathname).toLowerCase();
  return path.endsWith("/") ? path.slice(0, -1) : path;
};

export { normalizeURL, getURLsFromHTML, crawl };
