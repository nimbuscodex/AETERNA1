import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryCard } from "@/components/CategoryCard";
import { getAllArticles } from "@/lib/content-loader";
import type { ArticleFrontmatter } from "@/types";

const CATEGORY_META = {
  filosofia: {
    title: "Filosofía",
    description: "Desde los presocráticos hasta el existencialismo moderno. Un viaje por las ideas que han dado forma a nuestra realidad.",
    image: "https://images.unsplash.com/photo-1543165796-5426273ea458?q=80&w=2070&auto=format&fit=crop"
  },
  literatura: {
    title: "Literatura",
    description: "Análisis críticos, movimientos literarios y las obras que definieron civilizaciones enteras.",
    image: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=2070&auto=format&fit=crop"
  },
  guias: {
    title: "Guías de Aprendizaje",
    description: "Rutas estructuradas para dominar nuevas habilidades, desde idiomas hasta arte y técnica.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2070&auto=format&fit=crop",
    subcategories: [
      { name: "Idiomas", slug: "idiomas", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2072&auto=format&fit=crop" },
      { name: "Fotografía", slug: "artes/fotografia", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop" },
      { name: "Filosofía Práctica", slug: "humanidades/filosofia", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" }
    ]
  }
};

interface CategoryPageProps {
  category: "filosofia" | "literatura" | "guias";
}

export function CategoryPage({ category }: CategoryPageProps) {
  const [articles, setArticles] = useState<ArticleFrontmatter[]>([]);
  const [loading, setLoading] = useState(true);
  const meta = CATEGORY_META[category];

  useEffect(() => {
    getAllArticles().then(data => {
      setArticles(data.filter(a => a.category === category));
      setLoading(false);
    });
  }, [category]);

  if (loading) return null;

  return (
    <div className="pb-40 bg-brand-offwhite min-h-screen">
      {/* Category Hero - Scholarly Style */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden border-b border-brand-border bg-brand-ink">
        <div className="absolute inset-0 w-full h-full opacity-40 grayscale group overflow-hidden">
          <img
            src={meta.image}
            alt={meta.title}
            className="w-full h-full object-cover transition-transform duration-[20s] ease-linear scale-100 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-20 mx-auto max-w-5xl px-8 w-full">
          <div className="flex flex-col items-center text-center">
            <span className="inline-block border border-brand-gold text-brand-gold text-[10px] font-bold uppercase tracking-[0.6em] px-4 py-1.5 mb-12">
              SECCIÓN {category === 'filosofia' ? 'I' : category === 'literatura' ? 'II' : 'III'}
            </span>
            <h1 className="font-serif text-7xl md:text-[8rem] text-brand-offwhite mb-8 tracking-tighter leading-none">
              {meta.title}
            </h1>
            <div className="w-16 h-px bg-brand-gold/50 mb-12"></div>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-sans font-light max-w-2xl italic tracking-tight">
              {meta.description}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-8 mt-32">
        {category === "guias" && (
          <section className="mb-48">
             <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-8">
                <div className="max-w-xl">
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold mb-4 block">Especializaciones</span>
                  <h2 className="font-serif text-5xl md:text-6xl text-brand-ink">Rutas de <span className="italic">Experticia</span></h2>
                </div>
                <p className="text-brand-muted text-lg max-w-xs font-sans font-light border-l border-brand-gold/20 pl-8">Metodologías aplicadas para el desarrollo de nuevas facultades intelectuales.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {(meta as any).subcategories?.map((sub: any) => (
                  <CategoryCard 
                    key={sub.slug}
                    title={sub.name}
                    description={`Rutas críticas para el dominio de ${sub.name.toLowerCase()}.`}
                    image={sub.image}
                    path={`/guias/${sub.slug}`}
                    count={articles.filter(a => a.subcategory === sub.slug).length}
                  />
                ))}
              </div>
          </section>
        )}

        <section>
          <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold mb-4 block">Catálogo Sistemático</span>
              <h2 className="font-serif text-5xl md:text-6xl text-brand-ink">Índice del <span className="italic">Canon</span></h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
              <span className="text-brand-ink">{articles.length}</span> Entradas Registradas
              <div className="w-1 h-1 bg-brand-gold"></div>
              Archivo Activo
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-32 gap-16">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
