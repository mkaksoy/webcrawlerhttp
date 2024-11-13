"use strict";

import { sort } from "../src/report.ts";
import { equal } from "https://deno.land/std@0.224.0/testing/asserts.ts";

Deno.test("sort pages", () => {
  const input = {
    "https://example.com": 2,
    "https://example.com/path": 1,
    "https://test.example.com": 3,
  };

  const actual = sort(input);
  const expected = [
    ["https://example.com/path", 1],
    ["https://example.com", 2],
    ["https://test.example.com", 3],
  ];

  if (!equal(actual, expected)) {
    throw new Error(JSON.stringify(actual) + ": " + JSON.stringify(expected));
  }
});
