"use strict";

import { normalizeURL, getURLsFromHTML } from "../src/crawler.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";

Deno.test("normalizeURL strip protocol", () => {
  const input = "https://test.example.com/path";

  const actual = normalizeURL({ url: input });
  const expected = "test.example.com/path";

  assertEquals(actual, expected);
});

Deno.test("normalizeURL strip trailing slash", () => {
  const input = "https://test.example.com/path/";
  const actual = normalizeURL({ url: input });
  const expected = "test.example.com/path";

  assertEquals(actual, expected);
});

Deno.test("normalizeURL capitals", () => {
  const input = "HTTPS://TEST.EXAMPLE.COM/PATH";
  const actual = normalizeURL({ url: input });
  const expected = "test.example.com/path";

  assertEquals(actual, expected);
});

Deno.test("normalizeURL strip http", () => {
  const input = "http://test.example.com/path";
  const actual = normalizeURL({ url: input });
  const expected = "test.example.com/path";

  assertEquals(actual, expected);
});

Deno.test("getURLsFromHTML absolute", () => {
  const HTMLBody = `
    <html>
      <body>
        <a href="https://example.com/">Example 1</a>
        <a href="https://test1.example.com/">Example 2</a>
      </body>
    </html>
  `;
  const input = "https://example.com/";
  const actual = getURLsFromHTML({ body: HTMLBody, baseUrl: input });
  const expected: string[] = [
    "https://example.com/",
    "https://test1.example.com/",
  ];

  assertEquals(actual, expected);
});

Deno.test("getURLsFromHTML relative", () => {
  const HTMLBody = `
    <html>
      <body>
        <a href="/path1/">Example 1</a>
        <a href="/path2/">Example 2</a>
      </body>
    </html>
  `;
  const input = "https://example.com";
  const actual = getURLsFromHTML({ body: HTMLBody, baseUrl: input });
  const expected: string[] = [
    "https://example.com/path1/",
    "https://example.com/path2/",
  ];

  assertEquals(actual, expected);
});

Deno.test("getURLsFromHTML both", () => {
  const HTMLBody = `
    <html>
      <body>
        <a href="https://example.com/path/">Example 1</a>
        <a href="/path/">Example 2</a>
      </body>
    </html>
  `;
  const input = "https://example.com";
  const actual = getURLsFromHTML({ body: HTMLBody, baseUrl: input });
  const expected: string[] = [
    "https://example.com/path/",
    "https://example.com/path/",
  ];

  assertEquals(actual, expected);
});

Deno.test("getURLsFromHTML invalid", () => {
  const HTMLBody = `
    <html>
      <body>
        <a href="invalid">Invalid URL</a>
      </body>
    </html>
  `;
  const input = "https://example.com/";
  const actual = getURLsFromHTML({ body: HTMLBody, baseUrl: input });
  const expected: string[] = [];

  assertEquals(actual, expected);
});
