type PagesRecord = Record<string, number>;

type CrawlOptions = {
  baseUrl: string;
  url: string;
  pages: PagesRecord;
};

type NormalizeURLOptions = {
  url: string;
};

type GetURLsFromHTMLOptions = {
  body: string;
  baseUrl: string;
};

export type {
  PagesRecord,
  CrawlOptions,
  NormalizeURLOptions,
  GetURLsFromHTMLOptions,
};
