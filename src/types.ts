export interface ArticleFrontmatter {
  title: string;
  description: string;
  slug: string;
  author: string;
  category: string;
  subcategory?: string;
  tags: string[];
  image: string;
  date: string;
  nivel?: number;
  insignia?: string;
  tipo?: "theory" | "practice" | "philosophy" | "milestone";
  _path?: string;
}

export interface Author {
  name: string;
  slug: string;
  bio: string;
  role: string;
  avatar: string;
  thought?: string;
  works: string[];
}

export type Category = "filosofia" | "literatura" | "autores" | "guias";
