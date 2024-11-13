"use strict";

import { crawl } from "./src/crawler.ts";
import { report } from "./src/report.ts";

async function main() {
  if (Deno.args.length <= 0) {
    console.log("No websites provided.");
    Deno.exit(1);
  }

  for (const [index, url] of Deno.args.entries()) {
    console.log(`Starting crawl of website ${index + 1}: ${url}...`);
    const pages = await crawl({ baseUrl: url, url, pages: {} });

    report({ pages });
  }
}

main();
