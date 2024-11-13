"use strict";

import { crawl } from "./src/crawler.ts";

function main() {
  const count = Deno.args.length;

  if (count <= 0) {
    console.log("No websites provided.");
    Deno.exit(1);
  } else {
    Deno.args.forEach((url, index) => {
      console.log(`Starting crawl of website ${index + 1}: ${url}...`);
      crawl(url)
    });
  }
}

main();
