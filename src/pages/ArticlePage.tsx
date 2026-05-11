import React, { useEffect, useState, useRef, useMemo, isValidElement } from "react";
import { useParams, useSearchParams, useLocation, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  AnimatePresence
} from "motion/react";
import {
  Share2,
  Printer,
  BrainCircuit,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Target,
  Hash,
  ChevronRight,
  Lock,
  Sparkles,
  Zap,
  ArrowDown,
  ArrowUp,
  Activity,
  Layers,
  ShieldCheck
} from "lucide-react";
import { getStructuredArticleBySlug } from "@/lib/content-loader";
import { formatDate, cn } from "@/lib/utils";
import { useGamification } from "@/context/GamificationContext";
import { AeternaPracticeProblem } from "@/components/AeternaPracticeProblem";
import { AeternaAffiliate } from "@/components/AeternaAffiliate";
import { AeternaExercise } from "@/components/AeternaExercise";
import { 
  AccionBotones, 
  BotonSimplificar, 
  BotonProfundizar, 
  BotonEjemplos, 
  BotonConexiones 
} from "@/components/interactive/AccionBotones";
import AeternaTable from "@/components/AeternaTable";
import { AeternaDecisionBox } from "@/components/interactive/AeternaDecisionBox";
import { AeternaInteractiveQuestion } from "@/components/interactive/AeternaInteractiveQuestion";
import { AeternaEngagement, AeternaEngagementSuite } from "@/components/AeternaEngagement";
import { BotonTransicion } from "@/components/interactive/BotonTransicion";
import { LevelProvider, useLevel } from "@/context/LevelContext";
import type { AeternaArticle } from "@/types";

import 'katex/dist/katex.min.css';

// --- CONFIGURACIÓN DE ESTILOS ---
const extractText = (node: any): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (isValidElement<{ children?: any }>(node)) return extractText(node.props.children);
  if (Array.isArray(node)) return node.map(extractText).join("");
  return "";
};

const markdownComponents: any = {
  p: ({ children }: any) => <p className="mb-10 text-[1.15rem] md:text-[21px] leading-[1.85] text-[#3E2C23] font-serif font-light tracking-tight text-justify">{children}</p>,
  h2: ({ children, id }: any) => (
    <h2 id={id} className="font-serif text-3xl md:text-5xl lg:text-7xl text-[#1A1A1A] mt-40 mb-16 tracking-tighter uppercase leading-[0.95] scroll-mt-32 relative">
       <span className="absolute -left-12 top-4 text-[#D4AF37]/20 font-mono text-xl hidden lg:block italic">A/</span>
       {children}
    </h2>
  ),
  h3: ({ children }: any) => <h3 className="font-serif text-2xl md:text-3xl text-[#8B6914] mt-24 mb-10 tracking-widest uppercase italic">{children}</h3>,
  blockquote({ children }: any) {
    const text = extractText(children);
    if (text.includes("💡") || text.includes("Idea clave")) return (
      <div className="my-20 relative py-14 px-10 md:px-20 bg-[#D4AF37]/5 border-l-4 border-[#D4AF37] rounded-r-[2rem] shadow-sm">
        <div className="absolute top-8 left-10 opacity-20"><Lightbulb className="w-10 h-10 text-[#8B6914]" /></div>
        <div className="relative z-10 font-serif italic text-2xl md:text-3xl text-[#1A1A1A] leading-relaxed pl-6">{children}</div>
      </div>
    );
    if (text.includes("🧠") || text.includes("Sistema Aeterna")) return (
      <div className="my-24 bg-black/[0.02] border border-[#d4af37]/30 p-12 md:p-20 relative overflow-hidden group rounded-[3rem] shadow-xl">
        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000"><BrainCircuit className="w-64 h-64 text-[#8B6914]" /></div>
        <div className="relative z-10 font-serif text-3xl text-[#1A1A1A] italic leading-snug mb-10">{children}</div>
        <div className="text-[10px] font-mono font-black tracking-[0.5em] text-[#8B6914] uppercase flex items-center gap-4">
           <div className="w-8 h-px bg-[#8B6914]/30" /> Integridad Cognitiva Verificada
        </div>
      </div>
    );
    return <blockquote className="my-20 md:my-32 relative border-l-2 border-[#D4AF37] bg-[#FDFBF7] p-12 italic text-[#3E2C23]/80 font-serif text-2xl md:text-4xl leading-relaxed shadow-inner rounded-r-[2rem]">{children}</blockquote>;
  },
  ul: ({ children }: any) => <ul className="mb-14 space-y-6 text-[1.15rem] md:text-[22px] text-[#3E2C23] font-serif font-light tracking-tight pl-12 list-none marker:text-[#D4AF37]">{children}</ul>,
  li: ({ children }: any) => <li className="relative pl-8 before:content-['◆'] before:absolute before:left-0 before:text-[#D4AF37]/40 before:text-xs before:top-2">{children}</li>,
  table: ({ children }: any) => <AeternaTable>{children}</AeternaTable>,
  code: ({ className, children }: any) => {
    const match = /language-([\w-]+)/.exec(className || "");
    const textContent = String(children).replace(/\n$/, "");
    if (match) {
      const type = match[1];
      if (type === "aeterna-practice" || type === "aeterna-resueltos") return <AeternaPracticeProblem content={textContent} />;
      if (type === "aeterna-exercise") return <AeternaExercise content={textContent} />;
      if (type === "aeterna-affiliate") return <AeternaAffiliate content={textContent} />;
      if (type === "aeterna-question") return <AeternaInteractiveQuestion content={textContent} />;
      if (type === "aeterna-decision") return <AeternaDecisionBox content={textContent} />;
      if (type === "aeterna-engagement") {
        const parts = textContent.split('|').map(p => p.trim());
        return <AeternaEngagement type={parts[0] as any} title={parts[1]} content={parts[2]} extra={parts[3]} />;
      }
      if (type === "aeterna-equation") return (
        <div className="my-20 bg-white border border-[#D4AF37]/30 p-16 text-center rounded-[3rem] shadow-2xl relative group overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
           <div className="font-mono text-3xl md:text-5xl text-[#1A1A1A] relative z-10 tracking-tighter">{textContent}</div>
           <div className="mt-10 text-[10px] font-mono font-black tracking-[0.4em] text-[#8B6914]/60 uppercase">Formulación Axiomática Universal</div>
        </div>
      );
    }
    return <code className="bg-[#8B6914]/5 text-[#8B6914] px-2 py-1 font-mono text-sm rounded-sm border border-[#8B6914]/10">{children}</code>;
  }
};

// --- COMPONENTES DE APOYO ---

function FloatingLevelLabel({ level }: { level: string }) {
  const levelNames: Record<string, string> = {
    principiante: "Capa I: Iniciación",
    intermedio: "Capa II: Exégesis",
    avanzado: "Capa III: Frontera"
  };

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-12 right-12 z-50 pointer-events-none"
    >
      <div className="bg-[#1A1A1A] text-[#D4AF37] px-8 py-5 rounded-full border border-[#D4AF37]/30 shadow-2xl backdrop-blur-xl flex items-center gap-5">
         <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]" />
         <span className="text-[11px] font-mono font-black uppercase tracking-[0.5em]">{levelNames[level] || level}</span>
      </div>
    </motion.div>
  );
}

function SidebarTOC({ sections, activeId, currentLevel }: { sections: any[], activeId: string, currentLevel: string }) {
  if (sections.length === 0) return null;
  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-48 space-y-16">
        <div className="relative pl-8 border-l border-black/5">
          <div className="text-[11px] font-mono font-black uppercase tracking-[0.6em] text-[#8B6914]/50 mb-10 flex items-center gap-3">
             <Hash size={14} className="text-[#D4AF37]" /> HITOS DE LA CAPA {currentLevel === 'principiante' ? 'I' : currentLevel === 'intermedio' ? 'II' : 'III'}
          </div>
          <nav className="space-y-10">
            {sections.map((s, idx) => {
              // Priority for level-specific titles if they exist
              const sectionTitle = typeof s.titulo === 'object' 
                ? (s.titulo[currentLevel] || s.titulo['principiante'] || s.id)
                : s.titulo;

              return (
                <a key={s.id} href={`#${s.id}`} className={cn("group block transition-all duration-700", activeId === s.id && "translate-x-4")}>
                  <div className="flex items-start gap-5">
                     <span className={cn("text-[11px] font-mono font-black transition-all duration-700", activeId === s.id ? "text-[#D4AF37] scale-125" : "text-black/10")}>{String(idx + 1).padStart(2, '0')}</span>
                     <span className={cn("text-[14px] tracking-widest leading-tight uppercase transition-all duration-700", activeId === s.id ? "text-black font-black" : "text-black/30 group-hover:text-black/60")}>{(sectionTitle || '').replace(/▶️|🧠|❓/g, '').trim()}</span>
                  </div>
                  {activeId === s.id && (
                    <motion.div layoutId="toc-line" className="w-12 h-0.5 bg-[#D4AF37] mt-3" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

function MasteryCommandCenter({ currentLevel, onChangeLevel, progress, xpGained, availableLevels }: any) {
  const levels = [
    { id: 'principiante', label: 'Capa I: Iniciación', color: 'bg-emerald-500' }, 
    { id: 'intermedio', label: 'Capa II: Exégesis', color: 'bg-blue-500' }, 
    { id: 'avanzado', label: 'Capa III: Frontera', color: 'bg-[#D4AF37]' }
  ];
  
  return (
    <div className="sticky top-0 z-[100] w-full bg-[#0D0D0F] text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border-b border-white/5">
      <div className="mx-auto max-w-[1600px] px-10 py-5 flex items-center justify-between gap-16">
         <div className="flex items-center gap-6 min-w-[200px]">
            <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]", levels.find(l => l.id === currentLevel)?.color.replace('bg-', 'text-') || "text-[#D4AF37]")} />
            <span className="text-[11px] font-mono font-black uppercase tracking-[0.6em] text-white/90">{currentLevel}</span>
         </div>
         <div className="flex-1 h-1 bg-white/5 rounded-full relative overflow-hidden">
            <motion.div 
              className={cn("absolute inset-y-0 left-0 rounded-full", levels.find(l => l.id === currentLevel)?.color || "bg-[#D4AF37]")} 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }} 
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }} 
            />
         </div>
         <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full flex items-center gap-4 group hover:bg-white/10 transition-colors">
            <Activity className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-xs font-mono font-black text-[#D4AF37] tracking-tighter">+{xpGained} XP</span>
         </div>
      </div>
      <div className="bg-black/40">
        <div className="mx-auto max-w-[1600px] px-10 flex">
          {levels.map((level) => {
            const isActive = currentLevel === level.id;
            const isAvailable = availableLevels.includes(level.id);
            return (
              <button 
                key={level.id} 
                disabled={!isAvailable} 
                onClick={() => onChangeLevel(level.id)} 
                className={cn(
                  "flex-1 py-5 flex items-center justify-center gap-4 text-[10px] font-mono font-black uppercase tracking-[0.5em] transition-all relative border-r border-white/5 last:border-0", 
                  isActive ? "bg-white text-black" : "text-white/20 hover:text-white/50 hover:bg-white/5", 
                  !isAvailable && "opacity-10 cursor-not-allowed grayscale"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full shadow-sm", level.color)} />
                {level.label}
                {!isAvailable && <Lock size={12} className="ml-2 opacity-40" />}
                {isActive && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#D4AF37]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- CONTENIDO DEL ARTÍCULO ---

function ArticleContent({ overrideSlug }: { overrideSlug?: string }) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = overrideSlug || paramSlug;
  const [searchParams, setSearchParams] = useSearchParams();
  const [article, setArticle] = useState<AeternaArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [transitioning, setTransitioning] = useState(false);
  
  const currentLevel = (searchParams.get("nivel") || "principiante").toLowerCase();
  const { scrollYProgress } = useScroll();
  const { completePath, progress: gamificationProgress } = useGamification();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getStructuredArticleBySlug(slug).then(data => {
        setArticle(data);
        setLoading(false);
        window.scrollTo(0, 0);
      }).catch(() => setLoading(false));
    }
  }, [slug]);

  const liveProgress = useMemo(() => Math.round(scrollYProgress.get() * 100), [scrollYProgress.get()]);

  const changeLevel = (newLevel: string) => {
    setTransitioning(true);
    setTimeout(() => { 
      setSearchParams({ nivel: newLevel }); 
      window.scrollTo(0, 0); 
      setTransitioning(false); 
    }, 800);
  };

  const secciones = article?.secciones || [];
  const availableLevels = useMemo(() => {
    const found = [];
    if (secciones.some(s => !!s.niveles.principiante)) found.push('principiante');
    if (secciones.some(s => !!s.niveles.intermedio)) found.push('intermedio');
    if (secciones.some(s => !!s.niveles.avanzado)) found.push('avanzado');
    return found;
  }, [secciones]);

  useEffect(() => {
    if (!loading && article && secciones.length > 0) {
      const hasCurrentLevel = secciones.some(s => !!s.niveles?.[currentLevel as keyof typeof s.niveles]);
      if (!hasCurrentLevel) {
        const fallback = availableLevels.includes('intermedio') ? 'intermedio' : availableLevels[0];
        if (fallback && fallback !== currentLevel) setSearchParams({ nivel: fallback });
      }
    }
  }, [loading, article, currentLevel, availableLevels, secciones, setSearchParams]);

  const displaySecciones = useMemo(() => {
    if (!article) return [];
    return secciones
      .filter(s => !!s.niveles?.[currentLevel as keyof typeof s.niveles])
      .map(s => {
        // Resolve dynamic title for this level
        const sectionTitle = typeof s.titulo === 'object' 
          ? (s.titulo[currentLevel as keyof typeof s.niveles] || s.titulo['principiante'] || s.id)
          : s.titulo;
          
        return { 
          ...s, 
          activeTitle: sectionTitle,
          activeContent: s.niveles[currentLevel as keyof typeof s.niveles] 
        };
      });
  }, [secciones, currentLevel, article]);

  useEffect(() => {
    if (!article) return;
    const observer = new IntersectionObserver((entries) => { 
      entries.forEach(e => { if (e.isIntersecting) setActiveHeadingId(e.target.id); }); 
    }, { rootMargin: "-150px 0px -50% 0px" });
    displaySecciones.forEach(s => { 
      const el = document.getElementById(s.id); 
      if (el) observer.observe(el); 
    });
    return () => observer.disconnect();
  }, [article, loading, currentLevel, displaySecciones]);

  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (loading) return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center"><div className="w-24 h-px bg-[#D4AF37] animate-pulse" /></div>;
  if (!article) return <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] flex items-center justify-center font-serif text-3xl uppercase tracking-widest italic opacity-20">Señal Perdida</div>;

  const { metadata, introduccion } = article;

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#1A1A1A] selection:bg-[#D4AF37] selection:text-white pb-64">
      <MasteryCommandCenter 
        currentLevel={currentLevel} 
        onChangeLevel={changeLevel} 
        progress={liveProgress} 
        xpGained={gamificationProgress.xpInSession || 0} 
        availableLevels={availableLevels} 
      />
      <FloatingLevelLabel level={currentLevel} />
      
      <AnimatePresence>
        {transitioning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center gap-10 backdrop-blur-3xl bg-white/90"
          >
            <BrainCircuit className="w-20 h-20 text-[#D4AF37] animate-[pulse_1.5s_ease-in-out_infinite]" />
            <span className="text-[12px] font-mono font-black uppercase tracking-[0.8em] text-[#8B6914] ml-[0.8em]">Sincronizando Nueva Capa</span>
            <div className="w-48 h-0.5 bg-black/5 rounded-full overflow-hidden">
               <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-full h-full bg-[#D4AF37]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative pt-48 pb-32 px-10 bg-[#FDFBF7] border-b border-black/5 overflow-hidden">
         <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none"><Layers size={500} /></div>
         <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-end relative z-10">
            <div>
               <div className="flex items-center gap-6 text-[11px] font-mono font-black uppercase tracking-[0.6em] text-[#8B6914] mb-16">
                  <span>{metadata.category}</span>
                  <div className="w-12 h-px bg-[#D4AF37]/50" />
                  <span className="opacity-40">{metadata.subcategory}</span>
               </div>
               <h1 className="font-serif text-5xl md:text-8xl lg:text-[10rem] leading-[0.85] tracking-tighter mb-16 uppercase italic">
                  {metadata.title.split(':').map((p, i) => (
                    <span key={i} className={i === 1 ? "block text-black/40 mt-4 not-italic font-light text-5xl md:text-7xl" : ""}>{p}</span>
                  ))}
               </h1>
               <div className="flex items-center gap-16 text-[10px] font-mono uppercase tracking-[0.4em] text-black/20">
                  <div className="flex flex-col gap-3"><span>Autor de Registro</span><span className="text-black font-black">{metadata.author}</span></div>
                  <div className="flex flex-col gap-3"><span>Descriptor de Datos</span><span className="text-black font-black uppercase">{metadata.slug.substring(0, 12)}</span></div>
               </div>
            </div>
            <div className="relative group overflow-hidden rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] aspect-[16/8] bg-[#F5F2ED]">
               <img src={metadata.image} className="w-full h-full object-cover grayscale contrast-125 opacity-70 group-hover:scale-110 transition-transform duration-[3s]" alt={metadata.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
               <div className="absolute bottom-12 left-12 right-12">
                  <p className="text-white text-2xl font-serif font-light leading-relaxed italic border-l-2 border-[#D4AF37] pl-8">{metadata.description}</p>
               </div>
            </div>
         </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-10 mt-40 flex flex-col xl:flex-row gap-40">
        <SidebarTOC sections={displaySecciones} activeId={activeHeadingId} currentLevel={currentLevel} />
        
        <main className="flex-1 max-w-4xl mx-auto xl:mx-0">
          {currentLevel === 'principiante' && introduccion && (
            <div className="prose prose-2xl max-w-none mb-48 border-b border-black/5 pb-32 italic text-[#3E2C23]/60 font-serif leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeSlug, rehypeKatex]} components={markdownComponents}>
                {introduccion}
              </ReactMarkdown>
            </div>
          )}

          <div className="space-y-80">
            {displaySecciones.map((seccion, idx) => (
              <section key={`${seccion.id}-${currentLevel}`} id={seccion.id} className="relative group">
                <div className="prose prose-2xl max-w-none">
                  <div className="flex items-center gap-6 mb-16">
                    <span className="text-[11px] font-mono font-black tracking-[0.8em] text-[#D4AF37] ml-[0.8em]">HITOS / {String(idx + 1).padStart(2, '0')}</span>
                    <div className="h-px flex-1 bg-black/5" />
                  </div>
                  <h2 className="font-serif text-4xl md:text-6xl lg:text-8xl text-[#1A1A1A] mb-20 tracking-tighter uppercase leading-[0.9] italic">
                    {seccion.activeTitle}
                  </h2>
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]} 
                    rehypePlugins={[rehypeSlug, rehypeKatex]} 
                    components={{
                      ...markdownComponents,
                      code({ className, children, ...props }: any) {
                        const textContent = extractText(children);
                        const match = /<BotonTransicion\s+nivel="([^"]+)">([\s\S]*?)<\/BotonTransicion>/.exec(textContent);
                        if (match) {
                           return <BotonTransicion nivel={match[1]}>{match[2]}</BotonTransicion>;
                        }
                        return markdownComponents.code({ className, children, ...props });
                      }
                    }}
                  >
                    {seccion.activeContent}
                  </ReactMarkdown>
                </div>
                
                {seccion.acciones && seccion.acciones.length > 0 && (
                  <div className="mt-24">
                    <AccionBotones>
                      {seccion.acciones.map((accion: any, aidx: number) => { 
                        const Btn = accion.tipo === 'BotonSimplificar' ? BotonSimplificar : accion.tipo === 'BotonProfundizar' ? BotonProfundizar : accion.tipo === 'BotonEjemplos' ? BotonEjemplos : BotonConexiones; 
                        return (
                          <Btn key={aidx}>
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>
                              {accion.contenido}
                            </ReactMarkdown>
                          </Btn>
                        ); 
                      })}
                    </AccionBotones>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-80 p-20 md:p-32 rounded-[5rem] bg-[#0D0D0F] text-white relative overflow-hidden text-center shadow-[0_100px_150px_-30px_rgba(0,0,0,0.4)]">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] animate-[pulse_5s_ease-in-out_infinite]" />
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
             
             <BrainCircuit className="w-24 h-24 text-[#D4AF37] mb-16 mx-auto animate-pulse" />
             
             {currentLevel === 'principiante' && (
               <div className="relative z-10">
                 <span className="text-[11px] font-mono font-black tracking-[1em] text-[#D4AF37] uppercase mb-10 block ml-[1em]">Estado: Fundamentos Asimilados</span>
                 <h3 className="font-serif text-5xl md:text-7xl mb-12 uppercase tracking-tighter italic">Iniciación Superada</h3>
                 <p className="text-white/30 font-serif text-xl mb-20 max-w-lg mx-auto font-light leading-relaxed">Su mente ha procesado la estructura básica. El Nexo está listo para la exégesis técnica.</p>
                 <button onClick={() => changeLevel('intermedio')} className="group relative px-24 py-8 bg-[#D4AF37] text-black font-black uppercase tracking-[0.6em] text-[12px] hover:bg-white transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                   <span className="relative z-10 flex items-center gap-6">Ascender a Capa II <Zap size={20} /></span>
                 </button>
               </div>
             )}
             
             {currentLevel === 'intermedio' && (
               <div className="relative z-10">
                 <span className="text-[11px] font-mono font-black tracking-[1em] text-[#D4AF37] uppercase mb-10 block ml-[1em]">Estado: Exégesis Sellada</span>
                 <h3 className="font-serif text-5xl md:text-7xl mb-12 uppercase tracking-tighter italic">Comprensión Técnica</h3>
                 <p className="text-white/30 font-serif text-xl mb-20 max-w-lg mx-auto font-light leading-relaxed">Los mecanismos internos son ahora parte de su mapa cognitivo. Los axiomas de frontera esperan.</p>
                 <button onClick={() => changeLevel('avanzado')} className="group relative px-24 py-8 bg-[#D4AF37] text-black font-black uppercase tracking-[0.6em] text-[12px] hover:bg-white transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                   <span className="relative z-10 flex items-center gap-6">Desbloquear Capa III <Lock size={20} /></span>
                 </button>
               </div>
             )}
             
             {currentLevel === 'avanzado' && (
               <div className="relative z-10">
                 <span className="text-[11px] font-mono font-black tracking-[1em] text-[#D4AF37] uppercase mb-10 block ml-[1em]">Estado: Gnosis Absoluta</span>
                 <h3 className="font-serif text-5xl md:text-7xl mb-12 uppercase tracking-tighter italic">Maestría de la Frontera</h3>
                 <p className="text-white/30 font-serif text-xl mb-20 max-w-lg mx-auto font-light leading-relaxed">Este tomo ha sido grabado permanentemente en su base de datos de la realidad.</p>
                 <button onClick={() => completePath(metadata.slug, { timeSpent: Date.now() - startTimeRef.current })} className="group relative px-24 py-8 bg-white text-black font-black uppercase tracking-[0.6em] text-[12px] hover:bg-[#D4AF37] transition-all shadow-2xl">
                   <span className="relative z-10 flex items-center gap-6">Sellar Tomo en el Nexo <Target size={20} /></span>
                 </button>
               </div>
             )}
          </div>
        </main>
      </div>

      {/* Footer Navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-2xl border-t border-black/5 py-6 px-12">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-[10px] font-mono font-black uppercase tracking-[0.5em] text-black/40">
            <ArrowDown size={16} className="animate-bounce text-[#D4AF37]" />
            <span>Desplázate para asimilar</span>
          </div>
          <div className="flex items-center gap-12">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-black/30 hover:text-black hover:border-black/30 transition-all shadow-sm"><ArrowUp size={20} /></button>
            <button 
              onClick={() => { 
                const portal = document.querySelector('.bg-\\[#0D0D0F\\]'); 
                portal?.scrollIntoView({ behavior: 'smooth' }); 
              }} 
              className="px-14 py-4 bg-black text-white font-black text-[11px] uppercase tracking-[0.6em] rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all shadow-xl shadow-black/10 flex items-center gap-4 group"
            >
              Completar Nivel <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticlePage(props: any) {
  return (
    <LevelProvider>
      <ArticleContent {...props} />
    </LevelProvider>
  );
}
