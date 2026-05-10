import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function getArticlePath(art: { slug: string; _path?: string }) {
  if (!art._path) return `/articulos/${art.slug}`;
  
  // Only apply hierarchical logic for guias content
  const pathPrefix = "/src/content/guias/";
  if (!art._path.includes(pathPrefix)) return `/articulos/${art.slug}`;
  
  const relativePath = art._path.slice(art._path.indexOf(pathPrefix) + pathPrefix.length);
  const parts = relativePath.split("/");
  
  if (parts.length >= 2) {
    // category/subcategory/slug.md or category/slug.md
    const categoryPart = parts[0];
    const subcategoryPart = parts.length > 2 ? parts[1] : null;
    const slugPart = art.slug;
    
    if (subcategoryPart) {
      return `/guias/${categoryPart}/${subcategoryPart}/${slugPart}`;
    } else {
      return `/guias/${categoryPart}/${slugPart}`;
    }
  }
  return `/articulos/${art.slug}`;
}
