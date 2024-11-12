"use strict";

import { assertEquals } from "jsr:@std/assert";
import { normalizeURL } from "../src/crawler.ts";

Deno.test("normalizeURL strip protocol", () => {
  const input = "https://test.example.com/path"
  const actual = normalizeURL(input)
  const expected = "test.example.com/path"

  assertEquals(actual, expected);
});

Deno.test("normalizeURL strip trailing slash", () => {
  const input = "https://test.example.com/path/"
  const actual = normalizeURL(input)
  const expected = "test.example.com/path"

  assertEquals(actual, expected);
});

Deno.test("normalizeURL capitals", () => {
  const input = "HTTPS://TEST.EXAMPLE.COM/PATH"
  const actual = normalizeURL(input)
  const expected = "test.example.com/path"

  assertEquals(actual, expected);
});

Deno.test("normalizeURL strip http", () => {
  const input = "http://test.example.com/path"
  const actual = normalizeURL(input)
  const expected = "test.example.com/path"

  assertEquals(actual, expected);
});
