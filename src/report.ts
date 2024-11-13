"use strict";

function report(pages: Record<string, number>) {
    console.log("|====================|\n|== CRAWLER REPORT ==|\n|====================|");
    const sortedPages = sort(pages);

    for (const [url, count] of sortedPages) {
      console.log(`Found ${count} links to page: ${url}`);
    }
  
}

function sort(pages: Record<string, number>) {
  const pagesArray = Object.entries(pages);
  return pagesArray.sort((a, b) => {
    return (a[1] as number) - (b[1] as number);
  });
}

export { sort, report };
