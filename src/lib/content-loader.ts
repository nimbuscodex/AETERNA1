import type { ArticleFrontmatter, AeternaArticle } from "@/types";

export async function getStructuredArticleBySlug(slug: string): Promise<AeternaArticle | null> {
  const modules = (import.meta as any).glob("/src/data/articles/*.json");
  
  // Try to find the module that matches the slug
  for (const path in modules) {
    if (path.includes(`${slug}.json`)) {
      const data = await modules[path]();
      return (data.default || data) as AeternaArticle;
    }
  }
  
  return null;
}

// Helper to parse frontmatter from string
function parseFrontmatter(markdown: string, filePath: string): { data: ArticleFrontmatter; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = markdown.match(frontmatterRegex);

  const filename = filePath.split('/').pop()?.replace(/\.(md|txt)$/, '') || 'untitled';
  let content = markdown.replace(frontmatterRegex, "").trim();
  
  const data: any = {
    slug: filename,
    title: filename,
    description: "",
    author: "Anónimo",
    category: "guias",
    tags: [],
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop",
    date: new Date().toISOString()
  };

  // If no frontmatter title, try to find the first H1
  if (!match || !data.title || data.title === filename) {
    const h1Match = content.match(/^# (.*)/);
    if (h1Match) {
      data.title = h1Match[1].trim();
      // Optionally remove the H1 from content if we use it as the main title in the page
      content = content.replace(/^# .*\r?\n?/, "").trim();
    }
  }

  if (match) {
    const dataString = match[1];
    dataString.split("\n").forEach(line => {
      const splitIndex = line.indexOf(":");
      if (splitIndex !== -1) {
        const key = line.slice(0, splitIndex).trim();
        let value = line.slice(splitIndex + 1).trim();
        
        // Remove quotes
        value = value.replace(/^["']|["']$/g, '');
        
        if (value.startsWith("[") && value.endsWith("]")) {
          // Parse array
          data[key] = value.slice(1, -1).split(",").map(v => v.trim().replace(/^["']|["']$/g, ''));
        } else {
          data[key] = value;
        }
      }
    });
  }

  // Final fallback for title if it's still the filename (clean it up)
  if (data.title === filename) {
    data.title = filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return { data: data as ArticleFrontmatter, content };
}

export function getAllArticlesSync(): ArticleFrontmatter[] {
  const modules1 = (import.meta as any).glob("/src/content/**/*.md", { as: "raw", eager: true });
  const modules2 = (import.meta as any).glob("/src/content/**/*.txt", { as: "raw", eager: true });
  const modules = { ...modules1, ...modules2 };
  const articles: ArticleFrontmatter[] = [];

  for (const path in modules) {
    const content = modules[path];
    if (typeof content === 'string') {
      const { data } = parseFrontmatter(content, path);
      // We attach the filepath to the data to know its category if needed
      data._path = path;
      articles.push(data);
    }
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllArticles(): Promise<ArticleFrontmatter[]> {
  const modules1 = (import.meta as any).glob("/src/content/**/*.md", { as: "raw" });
  const modules2 = (import.meta as any).glob("/src/content/**/*.txt", { as: "raw" });
  const modules = { ...modules1, ...modules2 };
  const articles: ArticleFrontmatter[] = [];

  for (const path in modules) {
    const content = await modules[path]();
    if (typeof content === "string") {
      const { data } = parseFrontmatter(content, path);
      data._path = path;
      articles.push(data);
    }
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticleBySlug(slug: string): Promise<{ data: ArticleFrontmatter; content: string } | null> {
  const modules1 = (import.meta as any).glob("/src/content/**/*.md", { as: "raw" });
  const modules2 = (import.meta as any).glob("/src/content/**/*.txt", { as: "raw" });
  const modules = { ...modules1, ...modules2 };
  
  for (const path in modules) {
    const content = await modules[path]();
    if (typeof content === 'string') {
      const parsed = parseFrontmatter(content, path);
      if (parsed.data.slug === slug) {
        return parsed;
      }
    }
  }
  
  return null;
}
