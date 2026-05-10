import { CATEGORIES_DATA } from "./categories";
import { getAllArticlesSync } from "../lib/content-loader";
import { getArticlePath } from "../lib/utils";

export interface Step {
  id: string;
  title: string;
  duration: string;
  description: string;
  type: "theory" | "practice" | "philosophy" | "milestone";
  status: "completed" | "current" | "locked";
  path?: string;
  level?: {
    num: number;
    title: string;
    badge: string;
  };
}

export const ROADMAPS: Record<string, { title: string; subtitle: string; description: string; content?: string; steps: Step[] }> = {
  guias: {
    title: "Guías Maestras",
    subtitle: "El Canon del Autodidacta",
    description: "Rutas sistémicas diseñadas para transformar la curiosidad en maestría técnica e intelectual.",
    content: "Nuestras Guías Maestras representan la culminación de un esfuerzo editorial por sintetizar el conocimiento humano en rutas accionables.",
    steps: []
  }
};

// Generar roadmaps base para cada categoría y subcategoría
CATEGORIES_DATA.forEach(cat => {
  ROADMAPS[cat.id] = {
    title: cat.name,
    subtitle: "Ruta de Aprendizaje",
    description: cat.description,
    content: `Explora el fascinante mundo de ${cat.name}. Esta ruta te guiará a través de sus principales disciplinas y enfoques.`,
    steps: [] // We'll populate dynamically
  };

  cat.subcategories.forEach(sub => {
    ROADMAPS[sub.id] = {
      title: sub.name,
      subtitle: cat.name,
      description: `Ruta de estudio profundo sobre ${sub.name}.`,
      content: sub.topics.length > 0 
        ? `Aprende los fundamentos de ${sub.name}, incluyendo temas clave como ${sub.topics.join(', ')}.`
        : `Aprende los fundamentos y la práctica avanzada de ${sub.name}.`,
      steps: []
    };
  });
});

// Populate dynamically from markdown files using `_path`
try {
  const articles = getAllArticlesSync();
  const articlesMap: Record<string, typeof articles> = {};
  
  articles.forEach(article => {
    if (!article._path) return;
    
    // Parse _path, typical: /src/content/guias/ciencias_naturales/fisica/4-fuerzas.md
    // Regex splits path segments after 'guias/'
    const match = article._path.match(/\/src\/content\/guias\/([^/]+)(\/([^/]+))?\/(.+)\.(md|txt)/);
    if (!match) return;

    let categoryId = match[1];
    let subcategoryId = match[3];
    let filename = match[4];

    // If there is no subcategory, match[3] will be undefined and filename will be in match[2] or match[4]
    // Let's refine parsing:
    const segs = article._path.replace("/src/content/guias/", "").split("/");
    categoryId = segs[0];
    if (segs.length > 2) {
      subcategoryId = segs[1];
    } else {
      subcategoryId = categoryId; // it belongs directly to category
    }

    const targetKey = segs.length > 2 ? subcategoryId : categoryId;
    
    if (!articlesMap[targetKey]) {
      articlesMap[targetKey] = [];
    }
    articlesMap[targetKey].push(article);
  });

  // Now create steps from articles
  Object.keys(ROADMAPS).forEach(key => {
    if (key === 'guias') return;
    const items = articlesMap[key] || [];
    
    // Sort items by nivel or sequentially
    items.sort((a, b) => {
      const aNivel = a.nivel || 99;
      const bNivel = b.nivel || 99;
      if (aNivel !== bNivel) {
        return aNivel - bNivel;
      }
      const aOrden = a.orden !== undefined ? a.orden : 99;
      const bOrden = b.orden !== undefined ? b.orden : 99;
      if (aOrden !== bOrden) {
        return aOrden - bOrden;
      }
      const typeScoreA = a.tipo === "practice" ? 1 : 0;
      const typeScoreB = b.tipo === "practice" ? 1 : 0;
      return typeScoreA - typeScoreB;
    });

    if (items.length > 0) {
      ROADMAPS[key].steps = items.map((art, index) => {
        return {
          id: art.slug,
          title: art.title,
          duration: "Lectura/Estudio",
          description: art.description || `Guía completa sobre ${art.title}`,
          type: (art.tipo as any) || "theory",
          status: index === 0 ? "current" : "locked",
          path: getArticlePath(art),
          level: {
            num: art.nivel || (index + 1),
            title: art.nivel_titulo || art.title,
            badge: art.insignia || "Explorador"
          }
        };
      });
    } else {
      // Keep empty if no articles found, so UI can adapt
      ROADMAPS[key].steps = [];
    }
  });

} catch (e) {
  console.log("Error loading dynamic roadmaps", e);
}

// (Removed the hardcoded ROADMAPS["fisica"] block since it will be auto-generated)
