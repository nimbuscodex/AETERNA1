import React, { useEffect, useState, isValidElement, Children } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from "motion/react";
import {
  ChevronRight,
  ChevronDown,
  Clock,
  User,
  Share2,
  Printer,
  Languages,
  Lightbulb,
  AlertTriangle,
  BrainCircuit,
  Bookmark,
  ArrowRightCircle,
  HelpCircle,
  Compass,
  List,
  X,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";
import { getArticleBySlug } from "@/lib/content-loader";
import { formatDate } from "@/lib/utils";
import { KanaTool } from "@/components/interactive/KanaTool";
import { KanaGameV2 } from "@/components/interactive/KanaGameV2";
import { AeternaExamTool } from "@/components/interactive/AeternaExamTool";
import { AeternaInteractiveQuestion } from "@/components/interactive/AeternaInteractiveQuestion";
import { AeternaDecisionBox } from "@/components/interactive/AeternaDecisionBox";
import AeternaTable from "@/components/AeternaTable";
import AeternaFaq from "@/components/AeternaFaq";
import { AeternaPracticeProblem } from "@/components/AeternaPracticeProblem";
import { AeternaExercise } from "@/components/AeternaExercise";
import { AeternaAffiliate } from "@/components/AeternaAffiliate";
import {
  BotonConexiones,
  BotonEjemplos,
  BotonProfundizar,
  BotonSimplificar,
  AccionBotones,
} from "@/components/interactive/AccionBotones";
import { NivelContenido } from "@/components/interactive/NivelContenido";
import { NivelSelector } from "@/components/interactive/NivelSelector";
import { ProgresionArticulo } from "@/components/interactive/ProgresionArticulo";
import { NivelActivo } from "@/components/interactive/NivelActivo";
import { MostrarEnNivel } from "@/components/interactive/MostrarEnNivel";
import { IndiceNivel } from "@/components/interactive/IndiceNivel";
import { BotonTransicion } from "@/components/interactive/BotonTransicion";
import { LevelProvider, useLevel } from "@/context/LevelContext";
import { useGamification } from "@/context/GamificationContext";
import type { ArticleFrontmatter } from "@/types";
import { ROADMAPS } from "@/data/roadmaps";

function SidebarTOC() {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Small delay to allow ReactMarkdown to render, especially after level changes
    const timeoutId = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll(".markdown-body h2, .markdown-body h3"),
      );
      const newHeadings = elements
        .map((el) => ({
          id: el.id,
          text: el.textContent?.replace(/▶️|❓|🧠|⚠️|📌/g, "").trim() || "",
          level: el.tagName === "H2" ? 2 : 3,
        }))
        .filter(
          (h) =>
            h.id &&
            h.text &&
            !h.text.includes("Siguiente parada") &&
            !h.text.includes("Para seguir explorando"),
        );

      setHeadings(newHeadings);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []); // Needs a way to depend on activeLevel changing

  const { activeLevel } = useLevel();
  // We add activeLevel as a dependency to the effect by recreating it:
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll(".markdown-body h2, .markdown-body h3"),
      );
      const newHeadings = elements
        .map((el) => ({
          id: el.id,
          text: el.textContent?.replace(/▶️|❓|🧠|⚠️|📌/g, "").trim() || "",
          level: el.tagName === "H2" ? 2 : 3,
        }))
        .filter(
          (h) =>
            h.id &&
            h.text &&
            !h.text.includes("Siguiente parada") &&
            !h.text.includes("Para seguir explorando"),
        );

      setHeadings(newHeadings);
    }, 400); // 400ms to ensure DOM updates and animations finish
    return () => clearTimeout(timeoutId);
  }, [activeLevel]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting elements
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by top coordinate to find the topmost visible
          visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="font-serif">
      <h4 className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-white/40 mb-8 border-b border-white/10 pb-4">
        {activeLevel
          ? `DEPTH: ${["principiante", "fundamentos"].includes((activeLevel || "").toLowerCase()) || activeLevel.includes("Capa 1") ? "LEVEL 01" : ["intermedio", "profundización"].includes((activeLevel || "").toLowerCase()) || activeLevel.includes("Capa 2") ? "LEVEL 02" : ["avanzado", "frontera"].includes((activeLevel || "").toLowerCase()) || activeLevel.includes("Capa 3") ? "LEVEL 03" : activeLevel.toUpperCase()}`
          : "INDEX"}
      </h4>
      <nav className="relative">
        <div className="absolute left-[3px] top-4 bottom-4 w-[1px] bg-white/5" />
        <ul className="space-y-5">
          {headings.map((heading) => (
            <li key={heading.id} className="relative">
              <a
                href={`#${heading.id}`}
                className={`block pl-6 text-[15px] transition-all duration-500 hover:text-white ${
                  activeId === heading.id
                    ? "text-white font-medium tracking-wide italic"
                    : "text-white/40 font-light"
                } ${heading.level === 3 ? "pl-10 text-sm opacity-60" : ""}`}
              >
                {activeId === heading.id && (
                  <motion.div
                    layoutId="toc-indicator"
                    className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rotate-45 border border-[#D4AF37] bg-[#D4AF37] z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function MobileTOC({ isMobileTocOpen, setIsMobileTocOpen }: any) {
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const { activeLevel } = useLevel();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll(".markdown-body h2, .markdown-body h3"),
      );
      const newHeadings = elements
        .map((el) => ({
          id: el.id,
          text: el.textContent?.replace(/▶️|❓|🧠|⚠️|📌/g, "").trim() || "",
          level: el.tagName === "H2" ? 2 : 3,
        }))
        .filter(
          (h) =>
            h.id &&
            h.text &&
            !h.text.includes("Siguiente parada") &&
            !h.text.includes("Para seguir explorando"),
        );

      setHeadings(newHeadings);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [activeLevel]);

  if (headings.length === 0) return null;

  return (
    <div className="space-y-6 mt-4 font-serif">
      <div>
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-4 border-b border-white/10 pb-3">
          {activeLevel ? `DEPTH: ${activeLevel.toUpperCase()}` : "INDEX"}
        </h4>
        <nav className="text-sm space-y-4 font-mono">
          {headings.map((heading) => (
            <a
              key={`mobile-inline-${heading.id}`}
              href={`#${heading.id}`}
              onClick={() => setIsMobileTocOpen(false)}
              className={`block text-white/40 hover:text-white transition-colors ${
                heading.level === 3 ? "pl-4 text-xs opacity-60" : ""
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

function ArticleProgressBar({ articleTitle, currentStepTitle }: any) {
  const { activeLevel } = useLevel();
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll(".markdown-body h2"),
      );
      const newHeadings = elements
        .map((el) => ({
          id: el.id,
          text: el.textContent?.replace(/▶️|❓|🧠|⚠️|📌/g, "").trim() || "",
          level: 2,
        }))
        .filter(
          (h) =>
            h.id &&
            h.text &&
            !h.text.includes("Siguiente parada") &&
            !h.text.includes("Para seguir explorando"),
        );

      setHeadings(newHeadings);
      if (newHeadings.length > 0 && activeHeadingId === "") {
        setActiveHeadingId(newHeadings[0].id);
      }
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [activeLevel]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -40% 0px" },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="w-full mx-auto mb-24 mt-8 font-mono no-print px-0 sticky top-[60px] z-40 bg-[#09090B]/80 backdrop-blur-xl pt-6 pb-6 border-y border-white/5">
      <div className="flex justify-between items-center mb-6 px-4">
        <span className="text-[9px] font-medium tracking-[0.4em] uppercase text-white/40 truncate pr-6">
          PHASE:{" "}
          <span className="text-white italic">
            {currentStepTitle || articleTitle}
          </span>
        </span>
        <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase shrink-0 italic">
          <span className="text-[#D4AF37]">
            {Math.max(
              1,
              headings.findIndex((h) => h.id === activeHeadingId) + 1,
            )}
          </span>{" "}
          / {headings.length}
        </span>
      </div>

      <div className="relative flex items-center h-1 py-0 px-4">
        <div className="absolute left-4 right-4 h-[1px] bg-white/5 z-0"></div>
        <div
          className="absolute left-4 h-[1px] bg-[#D4AF37] z-0 transition-all duration-700 ease-in-out"
          style={{
            width: `calc(${
              headings.length > 1
                ? (Math.max(
                    0,
                    headings.findIndex((h) => h.id === activeHeadingId),
                  ) /
                    (headings.length - 1)) *
                  100
                : 0
            }% - 8px)`,
          }}
        ></div>
        <div className="absolute left-4 right-4 flex justify-between z-10 w-[calc(100%-32px)]">
          {headings.map((heading, idx) => {
            const activeIdx = headings.findIndex(
              (h) => h.id === activeHeadingId,
            );
            const isCurrent = idx === activeIdx;
            const isPast = idx < activeIdx;

            return (
              <div
                key={heading.id}
                className={`w-1 h-1 rounded-full transition-all duration-700 ${isCurrent ? "bg-[#D4AF37] scale-[2.5] shadow-[0_0_15px_#D4AF37]" : isPast ? "bg-white/40" : "bg-white/10"}`}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="text-center mt-6">
        <span className="font-mono text-[9px] tracking-[0.2em] text-white/20 uppercase transition-all duration-300">
          SECTION: <span className="text-white/60">{headings.find((h) => h.id === activeHeadingId)?.text || headings[0]?.text}</span>
        </span>
      </div>
    </div>
  );
}

const ARTICLE_QUESTIONS: Record<string, any[]> = {
  "mecanica-clasica": [
    {
      id: "mc1",
      question: "¿Qué describe la cinemática en la mecánica clásica?",
      options: [
        "Las causas del movimiento",
        "El lenguaje matemático del universo (cómo se mueve algo sin buscar sus causas)",
        "La cantidad de energía",
        "El momento angular",
      ],
      correctOption: 1,
    },
    {
      id: "mc2",
      question:
        "Según la cinemática, ¿qué diferencia a la velocidad de la aceleración?",
      options: [
        "Miden lo mismo, pero en distintas unidades",
        "La velocidad es escalar, la aceleración es vector",
        "La velocidad describe el cambio de posición, la aceleración el cambio de velocidad",
        "Ambas causan el movimiento",
      ],
      correctOption: 2,
    },
    {
      id: "mc3",
      question: "¿Cuál es la primera ley de Newton?",
      options: [
        "Acción y reacción",
        "F = m · a",
        "Ley de la Inercia (todo cuerpo persevera en su estado hasta que una fuerza lo cambie)",
        "Principio de Arquímedes",
      ],
      correctOption: 2,
    },
    {
      id: "mc4",
      question:
        "En la ecuación de la segunda ley de Newton (F = m · a), la masa representa:",
      options: [
        "El volumen del objeto",
        "El peso del objeto en la Tierra",
        "La resistencia al cambio de movimiento (inercia)",
        "La cantidad de energía almacenada",
      ],
      correctOption: 2,
    },
    {
      id: "mc5",
      question:
        "¿Por qué funcionan los cohetes espaciales en el vacío, según la Tercera Ley de Newton?",
      options: [
        "Porque no hay rozamiento en el espacio",
        "Porque expulsan gases hacia abajo (acción) y reciben un empuje hacia arriba (reacción)",
        "Por la conservación de la energía mecánica",
        "Por la inercia de la nave",
      ],
      correctOption: 1,
    },
    {
      id: "mc6",
      question:
        "La energía cinética depende principalmente de dos factores. ¿Cuáles son?",
      options: [
        "La masa y la altura",
        "La fuerza y la distancia",
        "La masa y la velocidad al cuadrado",
        "La presión y el área",
      ],
      correctOption: 2,
    },
    {
      id: "mc7",
      question:
        "¿Qué afirma el Principio de Pascal aplicado a fluidos incompresibles?",
      options: [
        "Que todo cuerpo flota si su peso es menor",
        "Que la presión cambia dependiendo de la altura",
        "Un cambio de presión se transmite íntegramente a todos los puntos del fluido",
        "Que los líquidos no tienen fuerzas",
      ],
      correctOption: 2,
    },
    {
      id: "mc8",
      question: "¿Por qué flota un barco de acero según Arquímedes?",
      options: [
        "Porque su diseño es aerodinámico",
        "Porque el casco desplaza un volumen de agua que pesa más que el navío entero",
        "Porque tiene aire atrapado que carece de masa",
        "Porque la tensión superficial del mar es constante",
      ],
      correctOption: 1,
    },
    {
      id: "mc9",
      question:
        "Al retraer los brazos, una patinadora aumenta su velocidad de giro debido a:",
      options: [
        "La conservación de la energía potencial",
        "La tercera ley de Newton",
        "La conservación del momento angular",
        "Una reducción de la fricción del hielo",
      ],
      correctOption: 2,
    },
    {
      id: "mc10",
      question:
        "¿En qué situación NO falla la mecánica clásica, por lo que sigue siendo un modelo excelente?",
      options: [
        "Velocidades cercanas a las de la luz",
        "El mundo cuántico subatómico",
        "Campos gravitatorios extremos, como un agujero negro",
        "Nuestro mundo cotidiano y experiencias a escala humana",
      ],
      correctOption: 3,
    },
  ],
};

// Helper to extract text from React children
const extractText = (node: any): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (isValidElement<{ children?: any }>(node)) {
    return extractText(node.props.children);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }
  return "";
};

const markdownComponents: any = {
  h1: ({ children, ...props }: any) => (
    <h1
      className="font-serif text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] font-medium text-white leading-[0.95] tracking-[-0.04em] mt-32 mb-16"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2
      className="font-serif text-[2.5rem] md:text-[3.5rem] font-medium text-white leading-[1.1] tracking-tight mt-28 mb-12 pb-6 border-b border-white/10 relative"
      {...props}
    >
      <span className="absolute -bottom-[1px] left-0 w-32 h-[2px] bg-white"></span>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3
      className="font-body text-[14px] md:text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mt-24 mb-10 flex items-center gap-6"
      {...props}
    >
      <div className="w-16 h-[1px] bg-[#D4AF37]/50" />
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p
      className="font-body text-[1.125rem] md:text-[1.25rem] text-white/70 leading-relaxed mb-12 font-normal"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-none space-y-8 my-14" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: any) => (
    <li
      className="font-body text-[1.125rem] md:text-[1.25rem] text-white/70 leading-relaxed font-normal flex items-start group"
      {...props}
    >
      <span className="text-white/30 mr-6 mt-2 font-body text-[10px] group-hover:text-[#D4AF37] transition-colors duration-300">
        0/
      </span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  a: ({ children, ...props }: any) => (
    <a
      className="text-white font-semibold underline underline-offset-4 decoration-white/20 hover:decoration-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote({ children, className, ...props }: any) {
    const text = extractText(children);

    // 🔗 Siguiente paso
    if (
      text.includes("🔗") ||
      text.includes("Siguiente paso") ||
      text.includes("Próximo paso")
    ) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -8 }}
          className="my-16 md:my-20 p-8 sm:p-12 rounded-none bg-[#FAFAFA] border-t border-b border-brand-ink flex flex-col sm:flex-row gap-8 items-start transition-all duration-300 group"
        >
          <div className="flex-shrink-0 text-brand-ink">
            <Compass className="w-8 h-8" strokeWidth={1} />
          </div>
          <div
            className="flex-1 prose-p:!mt-0 prose-p:!mb-4 prose-p:!text-brand-ink/80 last:prose-p:!mb-0 text-brand-ink/80 font-body text-[1.1875rem] leading-[1.8]
            [&>*:first-child]:!text-brand-ink [&>*:first-child]:!font-sans [&>*:first-child]:!tracking-[0.2em] [&>*:first-child]:!uppercase [&>*:first-child]:!text-[10px] [&>*:first-child]:mb-6
            [&>*:first-child_strong]:!text-brand-ink [&>*:first-child_strong]:!font-sans [&>*:first-child_strong]:!tracking-[0.2em] [&>*:first-child_strong]:!text-[10px]
            [&_strong]:!text-brand-ink [&_strong]:!font-bold [&_a]:!font-medium [&_a]:!text-brand-gold hover:[&_a]:!text-brand-gold"
          >
            {children}
          </div>
        </motion.div>
      );
    }

    // 💡 Idea clave
    if (text.includes("💡")) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="my-16 relative py-12 px-8 md:px-16"
        >
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-brand-gold" />
          <div className="absolute top-0 bottom-0 left-2 w-[1px] bg-brand-gold/30" />
          <div className="relative z-10 w-full">
            <div
              className="prose-p:!mt-0 prose-p:!mb-4 prose-p:!text-brand-ink last:prose-p:!mb-0 text-brand-ink font-serif font-normal text-[1.5rem] md:text-[1.75rem] leading-[1.5] tracking-[-0.01em]
              [&>*:first-child]:!text-brand-gold [&>*:first-child]:!font-sans [&>*:first-child]:!font-bold [&>*:first-child]:!text-[10px] [&>*:first-child]:tracking-[0.3em] [&>*:first-child]:uppercase [&>*:first-child]:mb-8 [&>*:first-child]:block
              [&>*:first-child_strong]:!text-brand-gold [&>*:first-child_strong]:!font-bold"
            >
              {children}
            </div>
          </div>
        </motion.div>
      );
    }

    // ⚠️ Error común
    if (text.includes("⚠️")) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="my-16 overflow-hidden bg-brand-ink text-white relative group flex items-center"
        >
          <div className="p-10 sm:p-12 md:p-16 relative z-10 w-full border-t border-b border-brand-ink">
            <div
              className="prose-p:!mt-0 prose-p:!mb-4 prose-p:!text-white/90 last:prose-p:!mb-0 text-white/90 font-body text-[1.1875rem] leading-[1.8]
              [&>*:first-child]:!text-red-400 [&>*:first-child]:!font-sans [&>*:first-child]:!tracking-[0.2em] [&>*:first-child]:!uppercase [&>*:first-child]:!text-[10px] [&>*:first-child]:mb-6 [&>*:first-child]:block
              [&_strong]:!text-white"
            >
              {children}
            </div>
          </div>
        </motion.div>
      );
    }

    // 🧠 Sistema Aeterna
    if (text.includes("🧠")) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="my-16 bg-[#FAFAFA] border border-brand-ink/10 relative p-10 md:p-16"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <BrainCircuit className="w-24 h-24 text-brand-ink" />
          </div>
          <div className="relative z-10 w-full">
            <div
              className="prose-p:!mt-0 prose-p:!mb-4 prose-p:!text-brand-ink/90 last:prose-p:!mb-0 text-brand-ink/90 font-body text-[1.1875rem] leading-[1.8]
              [&>*:first-child]:!text-brand-gold [&>*:first-child]:!font-serif [&>*:first-child]:!text-[1.75rem] [&>*:first-child]:!italic [&>*:first-child]:mb-6 [&>*:first-child]:block
              [&>*:first-child_strong]:!text-brand-gold [&>*:first-child_strong]:!font-serif
              [&_strong]:!text-brand-ink"
            >
              {children}
            </div>
          </div>
        </motion.div>
      );
    }

    // 📌 Resumen
    if (text.includes("📌")) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="my-16 overflow-hidden bg-brand-ink relative p-10 md:p-16"
        >
          <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
            <div
              className="prose-p:!mt-0 prose-p:!mb-4 prose-p:!text-white/90 last:prose-p:!mb-0 text-white/90 font-body text-[1.1875rem] md:text-[1.3125rem] leading-[1.8]
              [&>*:first-child]:!text-brand-gold [&>*:first-child]:!font-sans [&>*:first-child]:!tracking-[0.3em] [&>*:first-child]:uppercase [&>*:first-child]:!text-[10px] [&>*:first-child]:mb-8 [&>*:first-child]:block
              [&>*:first-child_strong]:!text-brand-gold [&>*:first-child_strong]:!font-sans [&>*:first-child_strong]:uppercase"
            >
              {children}
            </div>
          </div>
        </motion.div>
      );
    }

    // ❓ Pregunta
    if (text.includes("❓") || text.includes("Pregunta")) {
      const contentElements = React.Children.toArray(children);
      const titleElement = contentElements[0];

      const faqItemsData: {
        question: React.ReactNode;
        answer: React.ReactNode[];
      }[] = [];
      contentElements.slice(1).forEach((child) => {
        if (!React.isValidElement(child)) return;

        const pChildren = React.Children.toArray((child.props as any).children);
        const questionIndex = pChildren.findIndex(
          (c) => React.isValidElement(c) && (c as any).type === "strong",
        );

        if (questionIndex === -1) {
          if (faqItemsData.length > 0) {
            faqItemsData[faqItemsData.length - 1].answer.push(child);
          }
          return;
        }

        const question = pChildren[questionIndex];
        const answer = pChildren.slice(questionIndex + 1);
        const beforeQuestion = pChildren.slice(0, questionIndex);

        faqItemsData.push({
          question: (
            <>
              {beforeQuestion}
              {question}
            </>
          ),
          answer: [<div key={`ans-${faqItemsData.length}`}>{answer}</div>],
        });
      });

      return (
        <div className="my-16">
          <AeternaFaq
            title={titleElement}
            items={faqItemsData.map((item) => ({
              ...item,
              answer: (
                <div className="space-y-4 font-serif text-lg leading-relaxed text-brand-ink/80">
                  {item.answer}
                </div>
              ),
            }))}
          />
        </div>
      );
    }

    // Default blockquote
    return (
      <blockquote className="my-16 md:my-24 relative" {...props}>
        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-brand-gold/40" />
        <div className="pl-10 md:pl-16 pr-4 py-4">
          <div className="font-serif text-[1.75rem] md:text-[2.25rem] leading-[1.3] text-brand-ink/90 font-normal italic">
            {children}
          </div>
        </div>
      </blockquote>
    );
  },
  pre({ children, ...props }: any) {
    const childArray = React.Children.toArray(children);
    if (childArray.length === 1 && React.isValidElement(childArray[0])) {
      const child: any = childArray[0];
      if (
        child.type === "code" ||
        (typeof child.type === "function" && child.type.name === "code")
      ) {
        const childProps = child.props as any;
        const match = /language-([\w-]+)/.exec(childProps.className || "");
        if (
          match &&
          (match[1] === "aeterna-question" ||
            match[1] === "aeterna-decision" ||
            match[1] === "aeterna-equation" ||
            match[1] === "interactive-kana" ||
            match[1] === "interactive-kana-v2" ||
            match[1] === "aeterna-practice" ||
            match[1] === "aeterna-exercise" ||
            match[1] === "aeterna-resueltos" ||
            match[1] === "aeterna-resuelto" ||
            match[1] === "aeterna-affiliate" ||
            match[1] === "aeterna-boton" ||
            match[1] === "aeterna-accion-botones" ||
            match[1] === "aeterna-nivel-contenido" ||
            match[1] === "aeterna-nivel-selector" ||
            match[1] === "aeterna-progresion-articulo" ||
            match[1] === "aeterna-nivel-activo" ||
            match[1] === "aeterna-indice-nivel" ||
            match[1] === "aeterna-boton-transicion" ||
            match[1] === "aeterna-mostrar-en-nivel")
        ) {
          return <>{children}</>;
        }
      }
    }
    return (
      <pre
        className="bg-brand-ink text-brand-offwhite rounded-none p-8 overflow-x-auto my-12 border-l-4 border-brand-gold"
        {...props}
      >
        {children}
      </pre>
    );
  },
  code({ className, children, ...props }: any) {
    const match = /language-([\w-]+)/.exec(className || "");
    const textContent = extractText(children);
    if (match && match[1] === "aeterna-question") {
      return <AeternaInteractiveQuestion content={textContent} />;
    }
    if (match && match[1] === "aeterna-decision") {
      return <AeternaDecisionBox content={textContent} />;
    }
    if (match && match[1] === "aeterna-equation") {
      return (
        <div className="my-16 mx-auto max-w-3xl relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="bg-[#020202] border border-brand-gold/20 rounded-xl p-10 md:p-14 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)] group-hover:bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)] transition-all duration-1000" />

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-brand-gold/30 rounded-tl-xl transition-all duration-700 group-hover:w-20 group-hover:h-20 group-hover:border-brand-gold/60" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-brand-gold/30 rounded-tr-xl transition-all duration-700 group-hover:w-20 group-hover:h-20 group-hover:border-brand-gold/60" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-brand-gold/30 rounded-bl-xl transition-all duration-700 group-hover:w-20 group-hover:h-20 group-hover:border-brand-gold/60" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-brand-gold/30 rounded-br-xl transition-all duration-700 group-hover:w-20 group-hover:h-20 group-hover:border-brand-gold/60" />

            <div className="font-['Cinzel',serif] text-3xl md:text-4xl lg:text-5xl text-[#FCE69B] [text-shadow:0_0_15px_rgba(252,230,155,0.6)] tracking-[0.05em] text-center relative z-10 transition-transform duration-700 group-hover:scale-[1.02] leading-relaxed">
              {textContent.split("\n").map((line, i) => (
                <div key={i} className="my-5 tracking-wider">
                  {line}
                </div>
              ))}
            </div>

            <div className="mt-10 mb-[-10px] flex items-center gap-6 w-full justify-center relative z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700">
              <div className="h-px bg-gradient-to-r from-transparent to-brand-gold/50 flex-1 max-w-[80px]" />
              <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold" />
              <div className="font-serif italic text-[10px] text-brand-gold/80 tracking-[0.3em] uppercase">
                Fórmula Aeterna
              </div>
              <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold" />
              <div className="h-px bg-gradient-to-l from-transparent to-brand-gold/50 flex-1 max-w-[80px]" />
            </div>
          </div>
        </div>
      );
    }
    if (match && match[1] === "interactive-kana") {
      return <KanaTool />;
    }
    if (match && match[1] === "interactive-kana-v2") {
      return <KanaGameV2 />;
    }
    if (
      match &&
      (match[1] === "aeterna-practice" ||
        match[1] === "aeterna-resueltos" ||
        match[1] === "aeterna-resuelto")
    ) {
      return <AeternaPracticeProblem content={textContent} />;
    }
    if (match && match[1] === "aeterna-exercise") {
      return <AeternaExercise content={textContent} />;
    }
    if (match && match[1] === "aeterna-boton") {
      try {
        const data = JSON.parse(decodeURIComponent(atob(textContent)));
        const Component =
          data.type === "BotonSimplificar"
            ? BotonSimplificar
            : data.type === "BotonProfundizar"
              ? BotonProfundizar
              : data.type === "BotonEjemplos"
                ? BotonEjemplos
                : data.type === "BotonConexiones"
                  ? BotonConexiones
                  : BotonSimplificar;
        return (
          <Component>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug]}
              components={markdownComponents}
            >
              {data.content}
            </ReactMarkdown>
          </Component>
        );
      } catch (e) {
        return <div className="text-red-500">Error rendering button</div>;
      }
    }
    if (match && match[1] === "aeterna-accion-botones") {
      return (
        <AccionBotones>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={markdownComponents}
          >
            {decodeURIComponent(atob(textContent))}
          </ReactMarkdown>
        </AccionBotones>
      );
    }
    if (match && match[1] === "aeterna-nivel-contenido") {
      try {
        const levels = JSON.parse(decodeURIComponent(atob(textContent)));
        return (
          <NivelContenido
            principiante={
              levels.principiante ? (
                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSlug]}
                    components={markdownComponents}
                  >
                    {levels.principiante}
                  </ReactMarkdown>
                </div>
              ) : undefined
            }
            intermedio={
              levels.intermedio ? (
                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSlug]}
                    components={markdownComponents}
                  >
                    {levels.intermedio}
                  </ReactMarkdown>
                </div>
              ) : undefined
            }
            avanzado={
              levels.avanzado ? (
                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSlug]}
                    components={markdownComponents}
                  >
                    {levels.avanzado}
                  </ReactMarkdown>
                </div>
              ) : undefined
            }
          />
        );
      } catch (e) {
        return (
          <div className="text-red-500">Error rendering content level</div>
        );
      }
    }
    if (match && match[1] === "aeterna-nivel-selector") {
      try {
        const props = JSON.parse(decodeURIComponent(atob(textContent)));
        return (
          <NivelSelector
            niveles={props.niveles}
            nivelPorDefecto={props.nivelPorDefecto}
          />
        );
      } catch (e) {
        return (
          <LevelProvider>
            <NivelSelector />
          </LevelProvider>
        );
      }
    }
    if (match && match[1] === "aeterna-affiliate") {
      return <AeternaAffiliate content={textContent} />;
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  table({ children, ...props }: any) {
    return <AeternaTable>{children}</AeternaTable>;
  },
  thead({ children, ...props }: any) {
    return <thead {...props}>{children}</thead>;
  },
  tbody({ children, ...props }: any) {
    return <tbody {...props}>{children}</tbody>;
  },
  tr({ children, ...props }: any) {
    return <tr {...props}>{children}</tr>;
  },
  th({ children, ...props }: any) {
    return <th {...props}>{children}</th>;
  },
  td({ children, ...props }: any) {
    return <td {...props}>{children}</td>;
  },
};

export function ArticlePage({ overrideSlug }: { overrideSlug?: string }) {
  const params = useParams<{
    category?: string;
    subcategory?: string;
    slug?: string;
  }>();
  const category = params.category;
  const subcategory = params.subcategory;
  const slug = overrideSlug || params.slug;
  const navigate = useNavigate();
  const { activeLevel, setActiveLevel } = useLevel();
  const [article, setArticle] = useState<{
    data: ArticleFrontmatter;
    content: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [sessionResults, setSessionResults] = useState<
    { id: string; correct: boolean }[]
  >([]);

  const {
    updateArticleProgress,
    getArticleProgress,
    progress: gamificationProgress,
    completePath,
    isCompleted: isPathCompleted,
  } = useGamification();
  const { scrollYProgress } = useScroll();
  const maxScrollRef = React.useRef(0);
  const startTimeRef = React.useRef(Date.now());
  const maxVelocityRef = React.useRef(0);

  // Find the step corresponding to this article
  let currentStep = null;
  let currentCategory = null;
  let roadmapSteps: any[] = [];
  let roadmapTitle = "THE ALCHEMICAL PROCESS";

  for (const [key, roadmap] of Object.entries(ROADMAPS)) {
    const step = roadmap.steps.find((s) => s.id === slug);
    if (step) {
      currentStep = step;
      currentCategory = key;
      roadmapSteps = roadmap.steps;
      roadmapTitle = roadmap.title;
      break;
    }
  }

  const isCompleted =
    currentCategory && currentStep
      ? isPathCompleted(`${currentCategory}.${currentStep.id}`)
      : false;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!slug || loading) return;

    // Track instantaneous scroll velocity
    const currentVelocity = Math.abs(scrollYProgress.getVelocity());
    if (currentVelocity > maxVelocityRef.current) {
      maxVelocityRef.current = currentVelocity;
    }

    const currentPercent = Math.round(latest * 100);

    // Only update if we've moved forward and it's a meaningful threshold
    if (currentPercent > maxScrollRef.current && currentPercent > 0) {
      maxScrollRef.current = currentPercent;

      // Throttle updates: every 5% or 100%
      if (currentPercent % 5 === 0 || currentPercent >= 95) {
        const words = article?.content.trim().split(/\s+/).length || 0;
        updateArticleProgress(slug, currentPercent, {
          timeSpent: Date.now() - startTimeRef.current,
          wordCount: words,
          velocity: maxVelocityRef.current,
        });
      }
    }
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.2]);
  const imageY = useTransform(scrollYProgress, [0, 0.4], [0, 100]);

  useEffect(() => {
    if (slug) {
      maxScrollRef.current = getArticleProgress(slug);
    }
  }, [slug, getArticleProgress]);

  useEffect(() => {
    if (slug) {
      getArticleBySlug(slug).then((data) => {
        setArticle(data);
        setLoading(false);
        window.scrollTo(0, 0);
      });
    }
  }, [slug]);

  if (loading) return null;
  if (!article)
    return <div className="py-20 text-center">Artículo no encontrado</div>;

  const { data, content } = article;

  // Breadcrumb logic
  const categoryLink = subcategory
    ? `/guias/${category}/${subcategory}`
    : category
      ? `/guias/${category}`
      : `/${data.category.toLowerCase().replace(/\s+/g, "-")}`;
  const categoryName = subcategory
    ? subcategory.replace(/_/g, " ")
    : data.category;
  const slugger = new GithubSlugger();

  // Define components inside to access local state
  const components: any = {
    ...markdownComponents,
    code({ className, children, ...props }: any) {
      const match = /language-([\w-]+)/.exec(className || "");
      const textContent = extractText(children);

      if (match && match[1] === "aeterna-question") {
        // Track unique question result for precision
        const questionId = btoa(
          encodeURIComponent(
            textContent.split("\n")[0].replace("Pregunta:", "").trim(),
          ),
        ).substring(0, 32);

        return (
          <AeternaInteractiveQuestion
            content={textContent}
            onResult={(correct: boolean) => {
              setSessionResults((prev) => {
                if (prev.find((r) => r.id === questionId)) return prev;
                return [...prev, { id: questionId, correct }];
              });
            }}
          />
        );
      }

      if (match && match[1] === "aeterna-progresion-articulo") {
        try {
          const props = JSON.parse(decodeURIComponent(atob(textContent)));
          return (
            <ProgresionArticulo
              hitos={props.hitos}
              hitoInicial={props.hitoInicial}
            />
          );
        } catch (e) {
          return <div className="text-red-500">Error rendering progresion</div>;
        }
      }

      if (match && match[1] === "aeterna-nivel-activo") {
        try {
          const props = JSON.parse(decodeURIComponent(atob(textContent)));
          return (
            <NivelActivo id={props.id}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={components}
              >
                {props.content}
              </ReactMarkdown>
            </NivelActivo>
          );
        } catch (e) {
          return (
            <div className="text-red-500">Error rendering NivelActivo</div>
          );
        }
      }

      if (match && match[1] === "aeterna-indice-nivel") {
        try {
          const props = JSON.parse(decodeURIComponent(atob(textContent)));
          return (
            <IndiceNivel titulo={props.titulo}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={components}
              >
                {props.content}
              </ReactMarkdown>
            </IndiceNivel>
          );
        } catch (e) {
          return (
            <div className="text-red-500">Error rendering IndiceNivel</div>
          );
        }
      }

      if (match && match[1] === "aeterna-mostrar-en-nivel") {
        try {
          const props = JSON.parse(decodeURIComponent(atob(textContent)));
          return (
            <MostrarEnNivel nivel={props.nivel} niveles={props.niveles}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={components}
              >
                {props.content}
              </ReactMarkdown>
            </MostrarEnNivel>
          );
        } catch (e) {
          return (
            <div className="text-red-500">Error rendering MostrarEnNivel</div>
          );
        }
      }

      if (match && match[1] === "aeterna-boton-transicion") {
        try {
          const props = JSON.parse(decodeURIComponent(atob(textContent)));
          return (
            <BotonTransicion nivel={props.nivel}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={components}
              >
                {props.content}
              </ReactMarkdown>
            </BotonTransicion>
          );
        } catch (e) {
          return (
            <div className="text-red-500">Error rendering BotonTransicion</div>
          );
        }
      }

      // Fallback
      if (markdownComponents.code) {
        return markdownComponents.code({ className, children, ...props });
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  const words = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / 225) || 1;

  // Pre-process markdown to convert custom blocks to code blocks
  let processedContent = content;

  const dedent = (text: string) => {
    const lines = text.split("\n");
    let minIndent = Infinity;
    for (const line of lines) {
      if (line.trim().length > 0) {
        const indent = line.match(/^[ \t]*/)?.[0].length || 0;
        minIndent = Math.min(minIndent, indent);
      }
    }
    if (minIndent === Infinity || minIndent === 0) return text;
    return lines
      .map((line) =>
        line.length >= minIndent ? line.substring(minIndent) : line,
      )
      .join("\n");
  };

  // Render Botones (we process innermost first)
  const BOTON_TYPES = [
    "BotonSimplificar",
    "BotonProfundizar",
    "BotonEjemplos",
    "BotonConexiones",
  ];
  BOTON_TYPES.forEach((type) => {
    const regex = new RegExp(`<${type}>([\\s\\S]*?)<\\/${type}>`, "g");
    processedContent = processedContent.replace(regex, (match, inner) => {
      return `\n\`\`\`aeterna-boton\n${btoa(encodeURIComponent(JSON.stringify({ type, content: dedent(inner) })))}\n\`\`\`\n`;
    });
  });

  // AccionBotones
  processedContent = processedContent.replace(
    /<AccionBotones>([\s\S]*?)<\/AccionBotones>/g,
    (match, inner) => {
      return `\n\`\`\`aeterna-accion-botones\n${btoa(encodeURIComponent(dedent(inner)))}\n\`\`\`\n`;
    },
  );

  // AeternaDecisionBox handling when passed structurally
  processedContent = processedContent.replace(
    /<AeternaDecisionBox([\s\S]*?)(?<!<)\/>/g,
    (match, propsStr) => {
      // Parse question
      const qMatch = propsStr.match(/question=["']([^"']+)["']/);
      const question = qMatch ? qMatch[1] : "";

      // Parse options
      const options: string[] = [];
      const optRegex = /text:\s*["']([^"']+)["']/g;
      let optMatch;
      while ((optMatch = optRegex.exec(propsStr)) !== null) {
        options.push(optMatch[1]);
      }

      // Parse correctIndex
      const idxMatch = propsStr.match(/correctIndex=\{?(\d+)\}?/);
      const correctIndex = idxMatch ? parseInt(idxMatch[1]) : 0;

      let newContent = `Pregunta: ${question}\nOpciones:\n`;
      options.forEach((opt) => {
        newContent += `- ${opt}\n`;
      });
      if (options[correctIndex]) {
        newContent += `RespuestaCorrecta: ${options[correctIndex]}\n`;
      }

      return `\n\`\`\`aeterna-question\n${newContent}\n\`\`\`\n`;
    },
  );

  // NivelContenido
  processedContent = processedContent.replace(
    /<NivelContenido([\s\S]*?)(?<!<)\/>/g,
    (match, inner) => {
      const levels: any = {};
      const regex =
        /(principiante|intermedio|avanzado)=\{\s*<>\n?([\s\S]*?)\n?\s*<\/>\s*\}/g;
      let m;
      while ((m = regex.exec(inner)) !== null) {
        levels[m[1]] = dedent(m[2]);
      }
      if (Object.keys(levels).length === 0) {
        const backupRegex = /(principiante|intermedio|avanzado)=\{([^}]*)\}/g;
        let m2;
        while ((m2 = backupRegex.exec(inner)) !== null) {
          levels[m2[1]] = dedent(
            m2[2].replace(/^\s*<>\n?/, "").replace(/\n?\s*<\/>\s*$/, ""),
          );
        }
      }
      return `\n\`\`\`aeterna-nivel-contenido\n${btoa(encodeURIComponent(JSON.stringify(levels)))}\n\`\`\`\n`;
    },
  );

  // NivelSelector
  processedContent = processedContent.replace(
    /<NivelSelector([\s\S]*?)(?<!<)\/>/g,
    (match, propsStr) => {
      let niveles = ["Principiante", "Intermedio", "Avanzado"];
      let nivelPorDefecto = "Intermedio";

      const nivelesMatch = propsStr.match(/niveles=\{([^}]+)\}/);
      if (nivelesMatch) {
        try {
          const arrStr = nivelesMatch[1].replace(/'/g, '"');
          niveles = JSON.parse(arrStr);
        } catch (e) {}
      }

      const defMatch = propsStr.match(/nivelPorDefecto=["']([^"']+)["']/);
      if (defMatch) {
        nivelPorDefecto = defMatch[1];
      }

      return `\n\`\`\`aeterna-nivel-selector\n${btoa(encodeURIComponent(JSON.stringify({ niveles, nivelPorDefecto })))}\n\`\`\`\n`;
    },
  );

  // ProgresionArticulo
  processedContent = processedContent.replace(
    /<ProgresionArticulo([\s\S]*?)\/>/g,
    (match, propsStr) => {
      let hitos = ["Fundamentos", "Profundización", "Frontera"];
      let hitoInicial = "Fundamentos";

      const hitosMatch = propsStr.match(/hitos=\{([^}]+)\}/);
      if (hitosMatch) {
        try {
          const arrStr = hitosMatch[1].replace(/'/g, '"');
          hitos = JSON.parse(arrStr);
        } catch (e) {}
      }

      const hitoActivoMatch = propsStr.match(/hitoInicial=["']([^"']+)["']/);
      if (hitoActivoMatch) {
        hitoInicial = hitoActivoMatch[1];
      }

      return `\n\`\`\`aeterna-progresion-articulo\n${btoa(encodeURIComponent(JSON.stringify({ hitos, hitoInicial })))}\n\`\`\`\n`;
    },
  );

  // IndiceNivel
  processedContent = processedContent.replace(
    /<IndiceNivel\s+titulo=["']([^"']+)["']>([\s\S]*?)<\/IndiceNivel>/g,
    (match, titulo, inner) => {
      return `\n\`\`\`aeterna-indice-nivel\n${btoa(encodeURIComponent(JSON.stringify({ titulo, content: dedent(inner) })))}\n\`\`\`\n`;
    },
  );

  // BotonTransicion
  processedContent = processedContent.replace(
    /<BotonTransicion\s+nivel=["']([^"']+)["']>([\s\S]*?)<\/BotonTransicion>/g,
    (match, nivel, inner) => {
      return `\n\`\`\`aeterna-boton-transicion\n${btoa(encodeURIComponent(JSON.stringify({ nivel, content: dedent(inner) })))}\n\`\`\`\n`;
    },
  );

  // MostrarEnNivel
  processedContent = processedContent.replace(
    /<MostrarEnNivel\s+(?:nivel=["']([^"']+)["']\s*)?(?:niveles=\{([^}]+)\}\s*)?>([\s\S]*?)<\/MostrarEnNivel>/g,
    (match, nivel, nivelesStr, inner) => {
      let niveles = undefined;
      if (nivelesStr) {
        try {
          niveles = eval(nivelesStr); // Assuming it's written as ["Fundamentos"]
        } catch (e) {}
      }
      return `\n\`\`\`aeterna-mostrar-en-nivel\n${btoa(encodeURIComponent(JSON.stringify({ nivel, niveles, content: dedent(inner) })))}\n\`\`\`\n`;
    },
  );

  // NivelActivo
  processedContent = processedContent.replace(
    /<NivelActivo\s+id=["']([^"']+)["']>([\s\S]*?)<\/NivelActivo>/g,
    (match, id, inner) => {
      return `\n\`\`\`aeterna-nivel-activo\n${btoa(encodeURIComponent(JSON.stringify({ id, content: dedent(inner) })))}\n\`\`\`\n`;
    },
  );

  processedContent = processedContent.replace(
    /::aeterna-question([\s\S]*?)::/g,
    (match, inner) => {
      return `\`\`\`aeterna-question\n${inner.trim()}\n\`\`\``;
    },
  );

  processedContent = processedContent.replace(
    /::aeterna-decision([\s\S]*?)::/g,
    (match, inner) => {
      return `\`\`\`aeterna-decision\n${inner.trim()}\n\`\`\``;
    },
  );

  processedContent = processedContent.replace(
    /::aeterna-equation([\s\S]*?)::/g,
    (match, inner) => {
      return `\`\`\`aeterna-equation\n${inner.trim()}\n\`\`\``;
    },
  );

  // Pre-process practice problems for style
  if (data.tipo === "practice") {
    processedContent = processedContent.replace(
      /### ✅ Problema resuelto (.*?)\n([\s\S]*?)(?=\n### |\n## |\n---|\n\*\*Ejercicio|$)/g,
      (match, title, body) => {
        return `\`\`\`aeterna-practice\nTITLE: ${title.trim()}\n${body.trim()}\n\`\`\``;
      },
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-20">
      <h1 className="text-4xl mb-8">DEBUG MODE</h1>
      <p>Title: {data?.title || "No Title"}</p>
      <p>Slug: {slug}</p>
      <div className="prose prose-invert mt-10">
        <ReactMarkdown>{content.substring(0, 500)}</ReactMarkdown>
      </div>
    </div>
  );
}
