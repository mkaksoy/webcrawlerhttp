"use strict";

import { crawl } from "./src/crawler.ts";
import { report } from "./src/report.ts";

async function main() {
  const count = Deno.args.length;

  if (count <= 0) {
    console.log("No websites provided.");
    Deno.exit(1);
  } else {
    for (const [index, url] of Deno.args.entries()) {
      console.log(`Starting crawl of website ${index + 1}: ${url}...`);
      const pages = await crawl(url, url, {});

      report(pages)
    }
  }
}

main();
