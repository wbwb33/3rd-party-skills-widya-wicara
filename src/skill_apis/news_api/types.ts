export interface NewsApiType {
  status: string;
  totalResults: number;
  articles: Articles[];
}

export interface Articles {
  source: Source;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface Source {
  id: string;
  name: string;
}

export interface DataOutput {
  id: number;
  source: string;
  author: string;
  title: string;
  content: string;
}