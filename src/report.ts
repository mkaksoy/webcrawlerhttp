"use strict";

import { ReportOptions, PageOptions } from "../types/report.types.ts";

function report({ pages }: ReportOptions) {
  const sortedPages = Object.entries(pages).sort(
    (a, b) => (a[1] as number) - (b[1] as number)
  );

  console.log(
    `\n\n|============================|\n|====== CRAWLER REPORT ======|\n|============================|`
  );

  for (const [url, count] of sortedPages) {
    console.log(`Found ${count} links to page: ${url}`);
  }
}

function sort(pages: PageOptions): [string, number][] {
  return Object.entries(pages).sort((a, b) => a[1] - b[1]);
}

export { sort, report };
