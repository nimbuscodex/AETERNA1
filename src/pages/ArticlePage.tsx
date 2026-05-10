import React, { useEffect, useState, isValidElement, Children } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useMotionValueEvent } from "motion/react";
import { ChevronRight, ChevronDown, Clock, User, Share2, Printer, Languages, Lightbulb, AlertTriangle, BrainCircuit, Bookmark, ArrowRightCircle, HelpCircle, Compass, List, X, CheckCircle2, Lock } from "lucide-react";
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
import { BotonConexiones, BotonEjemplos, BotonProfundizar, BotonSimplificar, AccionBotones } from "@/components/interactive/AccionBotones";
import { NivelContenido } from "@/components/interactive/NivelContenido";
import { NivelSelector } from "@/components/interactive/NivelSelector";
import { LevelProvider } from "@/context/LevelContext";
import { useGamification } from "@/context/GamificationContext";
import type { ArticleFrontmatter } from "@/types";
import { ROADMAPS } from "@/data/roadmaps";

const ARTICLE_QUESTIONS: Record<string, any[]> = {
  "mecanica-clasica": [
    {
      id: 'mc1',
      question: '¿Qué describe la cinemática en la mecánica clásica?',
      options: [
        'Las causas del movimiento',
        'El lenguaje matemático del universo (cómo se mueve algo sin buscar sus causas)',
        'La cantidad de energía',
        'El momento angular'
      ],
      correctOption: 1
    },
    {
      id: 'mc2',
      question: 'Según la cinemática, ¿qué diferencia a la velocidad de la aceleración?',
      options: [
        'Miden lo mismo, pero en distintas unidades',
        'La velocidad es escalar, la aceleración es vector',
        'La velocidad describe el cambio de posición, la aceleración el cambio de velocidad',
        'Ambas causan el movimiento'
      ],
      correctOption: 2
    },
    {
      id: 'mc3',
      question: '¿Cuál es la primera ley de Newton?',
      options: [
        'Acción y reacción',
        'F = m · a',
        'Ley de la Inercia (todo cuerpo persevera en su estado hasta que una fuerza lo cambie)',
        'Principio de Arquímedes'
      ],
      correctOption: 2
    },
    {
      id: 'mc4',
      question: 'En la ecuación de la segunda ley de Newton (F = m · a), la masa representa:',
      options: [
        'El volumen del objeto',
        'El peso del objeto en la Tierra',
        'La resistencia al cambio de movimiento (inercia)',
        'La cantidad de energía almacenada'
      ],
      correctOption: 2
    },
    {
      id: 'mc5',
      question: '¿Por qué funcionan los cohetes espaciales en el vacío, según la Tercera Ley de Newton?',
      options: [
        'Porque no hay rozamiento en el espacio',
        'Porque expulsan gases hacia abajo (acción) y reciben un empuje hacia arriba (reacción)',
        'Por la conservación de la energía mecánica',
        'Por la inercia de la nave'
      ],
      correctOption: 1
    },
    {
      id: 'mc6',
      question: 'La energía cinética depende principalmente de dos factores. ¿Cuáles son?',
      options: [
        'La masa y la altura',
        'La fuerza y la distancia',
        'La masa y la velocidad al cuadrado',
        'La presión y el área'
      ],
      correctOption: 2
    },
    {
      id: 'mc7',
      question: '¿Qué afirma el Principio de Pascal aplicado a fluidos incompresibles?',
      options: [
        'Que todo cuerpo flota si su peso es menor',
        'Que la presión cambia dependiendo de la altura',
        'Un cambio de presión se transmite íntegramente a todos los puntos del fluido',
        'Que los líquidos no tienen fuerzas'
      ],
      correctOption: 2
    },
    {
      id: 'mc8',
      question: '¿Por qué flota un barco de acero según Arquímedes?',
      options: [
        'Porque su diseño es aerodinámico',
        'Porque el casco desplaza un volumen de agua que pesa más que el navío entero',
        'Porque tiene aire atrapado que carece de masa',
        'Porque la tensión superficial del mar es constante'
      ],
      correctOption: 1
    },
    {
      id: 'mc9',
      question: 'Al retraer los brazos, una patinadora aumenta su velocidad de giro debido a:',
      options: [
        'La conservación de la energía potencial',
        'La tercera ley de Newton',
        'La conservación del momento angular',
        'Una reducción de la fricción del hielo'
      ],
      correctOption: 2
    },
    {
      id: 'mc10',
      question: '¿En qué situación NO falla la mecánica clásica, por lo que sigue siendo un modelo excelente?',
      options: [
        'Velocidades cercanas a las de la luz',
        'El mundo cuántico subatómico',
        'Campos gravitatorios extremos, como un agujero negro',
        'Nuestro mundo cotidiano y experiencias a escala humana'
      ],
      correctOption: 3
    }
  ]
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
  blockquote({ children, className, ...props }: any) {
    const text = extractText(children);
    
    // 🔗 Siguiente paso
    if (text.includes('🔗') || text.includes('Siguiente paso') || text.includes('Próximo paso')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -8 }}
          className="my-10 md:my-14 p-6 sm:p-8 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row gap-5 items-start transition-all duration-300 hover:bg-emerald-50/40 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 group shadow-sm"
        >
          <div className="flex-shrink-0 bg-white p-3 rounded-xl border border-zinc-200 shadow-sm group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all duration-300 text-zinc-400">
            <Compass className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-1 prose-p:!mt-0 prose-p:!mb-3 prose-p:!text-zinc-600 last:prose-p:!mb-0 text-zinc-600 text-[15px] sm:text-base leading-relaxed
            [&>*:first-child]:!text-zinc-900 [&>*:first-child]:!font-medium [&>*:first-child]:!text-lg
            [&>*:first-child_strong]:!text-zinc-900 [&>*:first-child_strong]:!font-medium [&>*:first-child_strong]:!text-lg
            [&_strong]:!text-zinc-900 [&_a]:!font-medium [&_a]:!text-emerald-600 hover:[&_a]:!text-emerald-700">
            {children}
          </div>
        </motion.div>
      );
    }

    // 💡 Idea clave
    if (text.includes('💡')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          className="my-12 overflow-hidden border border-brand-border bg-white shadow-sm transition-shadow duration-500 relative group flex items-center min-h-[140px]"
        >
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[4rem] text-brand-gold/10 grayscale-0 opacity-40 select-none pointer-events-none z-0">
            💡
          </div>
          <div className="py-8 pl-24 pr-8 relative z-10 w-full">
            <div className="prose-p:!mt-0 prose-p:!text-brand-ink last:prose-p:!mb-0 text-brand-ink font-sans text-sm sm:text-base leading-relaxed
              [&>*:first-child]:!text-brand-gold [&>*:first-child]:!font-bold [&>*:first-child]:!text-[10px] [&>*:first-child]:tracking-[0.4em] [&>*:first-child]:uppercase [&>*:first-child]:mb-3 [&>*:first-child]:block
              [&>*:first-child_strong]:!text-brand-gold [&>*:first-child_strong]:!font-bold">
              {children}
            </div>
          </div>
        </motion.div>
      );
    }

    // ⚠️ Error común
    if (text.includes('⚠️')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          whileHover={{ y: -8 }}
          className="my-8 overflow-hidden rounded-3xl bg-[#F43F5E] shadow-xl shadow-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/40 transition-shadow duration-500 relative group flex items-center min-h-[120px]"
        >
          <div className="absolute -left-8 sm:-left-4 md:left-0 top-1/2 -translate-y-1/2 text-[5rem] md:text-[7rem] drop-shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 ease-out select-none pointer-events-none z-0 mix-blend-overlay opacity-40 sm:opacity-80 group-hover:opacity-60 sm:group-hover:opacity-100">
            ⚠️
          </div>
          <div className="p-5 sm:p-6 md:p-8 md:pl-28 relative z-10 w-full">
            <div className="prose-p:!mt-0 prose-p:!mb-3 prose-p:!text-white/90 last:prose-p:!mb-0 text-white/90 font-medium text-sm sm:text-base leading-relaxed
              [&_strong]:!text-white">
              {children}
            </div>
          </div>
        </motion.div>
      );
    }

    // 🧠 Sistema Aeterna
    if (text.includes('🧠')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          whileHover={{ y: -8 }}
          className="my-8 overflow-hidden rounded-3xl bg-[#1a1a1a] shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-black/60 transition-shadow duration-500 relative group flex items-center min-h-[120px]"
        >
          <div className="absolute -left-8 sm:-left-4 md:left-0 top-1/2 -translate-y-1/2 text-[5rem] md:text-[7rem] drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 ease-out select-none pointer-events-none z-0 opacity-10 sm:opacity-20 group-hover:opacity-20 sm:group-hover:opacity-30 grayscale-[0.8]">
            🧠
          </div>
          <div className="p-5 sm:p-6 md:p-8 md:pl-28 relative z-10 w-full">
            <div className="prose-p:!mt-0 prose-p:!mb-3 prose-p:!text-white last:prose-p:!mb-0 text-white font-medium text-sm sm:text-base leading-relaxed [text-shadow:0_0_10px_rgba(255,255,255,0.4)] [&_*]:[text-shadow:0_0_10px_rgba(255,255,255,0.4)]
              [&>*:first-child]:!text-[#FACC15] [&>*:first-child]:!font-serif [&>*:first-child]:!text-xl md:[&>*:first-child]:!text-xl [&>*:first-child]:!leading-tight [&>*:first-child]:uppercase [&>*:first-child]:mb-2 [&>*:first-child]:block [&>*:first-child]:[text-shadow:0_0_15px_rgba(250,204,21,0.5)]
              [&>*:first-child_strong]:!text-[#FACC15] [&>*:first-child_strong]:!font-serif [&>*:first-child_strong]:uppercase
              [&_strong]:!text-white [&_strong]:[text-shadow:0_0_15px_rgba(255,255,255,0.8)]">
              {children}
            </div>
          </div>
        </motion.div>
      );
    }

    // 📌 Resumen
    if (text.includes('📌')) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          whileHover={{ y: -8 }}
          className="my-8 overflow-hidden rounded-3xl bg-[#0EA5E9] shadow-xl shadow-sky-500/20 hover:shadow-2xl hover:shadow-sky-500/40 transition-shadow duration-500 relative group flex items-center min-h-[120px]"
        >
          <div className="absolute -left-8 sm:-left-4 md:left-0 top-1/2 -translate-y-1/2 text-[5rem] md:text-[7rem] drop-shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 ease-out select-none pointer-events-none z-0 mix-blend-overlay opacity-30 sm:opacity-70 group-hover:opacity-50 sm:group-hover:opacity-90">
            📌
          </div>
          <div className="p-5 sm:p-6 md:p-8 md:pl-28 relative z-10 w-full">
            <div className="prose-p:!mt-0 prose-p:!mb-3 prose-p:!text-white/90 last:prose-p:!mb-0 text-white/90 font-medium text-sm sm:text-base leading-relaxed
              [&>*:first-child]:!text-white [&>*:first-child]:!font-serif [&>*:first-child]:!text-xl md:[&>*:first-child]:!text-xl [&>*:first-child]:!leading-tight [&>*:first-child]:drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] [&>*:first-child]:uppercase [&>*:first-child]:mb-2 [&>*:first-child]:block
              [&>*:first-child_strong]:!text-white [&>*:first-child_strong]:!font-serif [&>*:first-child_strong]:uppercase">
              {children}
            </div>
          </div>
        </motion.div>
      );
    }

    // ❓ Pregunta
    if (text.includes('❓') || text.includes('Pregunta')) {
      const contentElements = React.Children.toArray(children);
      const titleElement = contentElements[0];
      
      const faqItemsData: { question: React.ReactNode, answer: React.ReactNode[] }[] = [];
      contentElements.slice(1).forEach((child) => {
        if (!React.isValidElement(child)) return;
        
        const pChildren = React.Children.toArray((child.props as any).children);
        const questionIndex = pChildren.findIndex(c => React.isValidElement(c) && (c as any).type === 'strong');
        
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
          question: <>{beforeQuestion}{question}</>,
          answer: [<div key={`ans-${faqItemsData.length}`}>{answer}</div>]
        });
      });

      return (
        <AeternaFaq 
          title={titleElement} 
          items={faqItemsData.map(item => ({
            ...item,
            answer: <div className="space-y-4">{item.answer}</div>
          }))} 
        />
      );
    }

    // Default blockquote
    return (
      <blockquote className="my-12 border-l-2 border-brand-ink bg-brand-border/10 italic p-10 text-brand-ink/80 font-serif text-xl leading-relaxed" {...props}>
        {children}
      </blockquote>
    );
  },
  pre({ children, ...props }: any) {
    const childArray = React.Children.toArray(children);
    if (childArray.length === 1 && React.isValidElement(childArray[0])) {
      const child: any = childArray[0];
      if (child.type === "code" || (typeof child.type === "function" && child.type.name === "code")) {
        const childProps = child.props as any;
        const match = /language-([\w-]+)/.exec(childProps.className || "");
        if (match && (match[1] === "aeterna-question" || match[1] === "aeterna-decision" || match[1] === "aeterna-equation" || match[1] === "interactive-kana" || match[1] === "interactive-kana-v2" || match[1] === "aeterna-practice" || match[1] === "aeterna-exercise" || match[1] === "aeterna-resueltos" || match[1] === "aeterna-resuelto" || match[1] === "aeterna-affiliate" || match[1] === "aeterna-boton" || match[1] === "aeterna-accion-botones" || match[1] === "aeterna-nivel-contenido" || match[1] === "aeterna-nivel-selector")) {
          return <>{children}</>;
        }
      }
    }
    return <pre className="bg-brand-ink text-brand-offwhite rounded-none p-8 overflow-x-auto my-12 border-l-4 border-brand-gold" {...props}>{children}</pre>;
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
               {textContent.split('\n').map((line, i) => <div key={i} className="my-5 tracking-wider">{line}</div>)}
             </div>
             
             <div className="mt-10 mb-[-10px] flex items-center gap-6 w-full justify-center relative z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700">
               <div className="h-px bg-gradient-to-r from-transparent to-brand-gold/50 flex-1 max-w-[80px]" />
               <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold" />
               <div className="font-serif italic text-[10px] text-brand-gold/80 tracking-[0.3em] uppercase">Fórmula Aeterna</div>
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
    if (match && (match[1] === "aeterna-practice" || match[1] === "aeterna-resueltos" || match[1] === "aeterna-resuelto")) {
      return <AeternaPracticeProblem content={textContent} />;
    }
    if (match && match[1] === "aeterna-exercise") {
      return <AeternaExercise content={textContent} />;
    }
    if (match && match[1] === "aeterna-boton") {
      try {
        const data = JSON.parse(decodeURIComponent(atob(textContent)));
        const Component = data.type === 'BotonSimplificar' ? BotonSimplificar :
                          data.type === 'BotonProfundizar' ? BotonProfundizar :
                          data.type === 'BotonEjemplos' ? BotonEjemplos :
                          data.type === 'BotonConexiones' ? BotonConexiones : BotonSimplificar;
        return (
          <Component>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={markdownComponents}>
              {data.content}
            </ReactMarkdown>
          </Component>
        );
      } catch(e) { return <div className="text-red-500">Error rendering button</div>; }
    }
    if (match && match[1] === "aeterna-accion-botones") {
      return (
        <AccionBotones>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={markdownComponents}>
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
            principiante={levels.principiante ? <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={markdownComponents}>{levels.principiante}</ReactMarkdown></div> : undefined}
            intermedio={levels.intermedio ? <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={markdownComponents}>{levels.intermedio}</ReactMarkdown></div> : undefined}
            avanzado={levels.avanzado ? <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={markdownComponents}>{levels.avanzado}</ReactMarkdown></div> : undefined}
          />
        );
      } catch(e) { return <div className="text-red-500">Error rendering content level</div>; }
    }
    if (match && match[1] === "aeterna-nivel-selector") {
      try {
        const props = JSON.parse(decodeURIComponent(atob(textContent)));
        return <NivelSelector niveles={props.niveles} nivelPorDefecto={props.nivelPorDefecto} />;
      } catch(e) { return <LevelProvider><NivelSelector /></LevelProvider>; }
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
    return (
      <AeternaTable>
        {children}
      </AeternaTable>
    );
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
  }
};

export function ArticlePage({ overrideSlug }: { overrideSlug?: string }) {
  const params = useParams<{ category?: string; subcategory?: string; slug?: string }>();
  const category = params.category;
  const subcategory = params.subcategory;
  const slug = overrideSlug || params.slug;
  const navigate = useNavigate();
  const [article, setArticle] = useState<{ data: ArticleFrontmatter; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ id: string; correct: boolean }[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  const { updateArticleProgress, getArticleProgress, progress: gamificationProgress, completePath, isCompleted: isPathCompleted } = useGamification();
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

  const isCompleted = currentCategory && currentStep ? isPathCompleted(`${currentCategory}.${currentStep.id}`) : false;

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
          velocity: maxVelocityRef.current
        });
      }
    }
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
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
      getArticleBySlug(slug).then(data => {
        setArticle(data);
        setLoading(false);
        window.scrollTo(0, 0);
      });
    }
  }, [slug]);

  useEffect(() => {
    if (!article || !article.content) return;
    
    const slugger = new GithubSlugger();
    const headers = article.content
      .split("\n")
      .filter((line) => line.startsWith("## "))
      .map((line) => {
        const text = line.replace("## ", "").replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/[*_~`]/g, '').trim();
        return { text, id: slugger.slug(text) };
      });
      
    if (headers.length === 0) return;
    if (activeHeadingId === "" && headers.length > 0) setActiveHeadingId(headers[0].id);
    
    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
               setActiveHeadingId(entry.target.id);
            }
          });
        },
        { rootMargin: "-80px 0px -40% 0px" } 
      );

      headers.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }, 500);

    return () => clearTimeout(timeout);
  }, [article]);

  if (loading) return null;
  if (!article) return <div className="py-20 text-center">Artículo no encontrado</div>;

  const { data, content } = article;

  // Breadcrumb logic
  const categoryLink = subcategory
    ? `/guias/${category}/${subcategory}` 
    : category 
      ? `/guias/${category}` 
      : `/${data.category.toLowerCase().replace(/\s+/g, '-')}`;
  const categoryName = subcategory ? subcategory.replace(/_/g, ' ') : data.category;
  const slugger = new GithubSlugger();

  // Define components inside to access local state
  const components: any = {
    ...markdownComponents,
    code({ className, children, ...props }: any) {
      const match = /language-([\w-]+)/.exec(className || "");
      const textContent = extractText(children);
      
      if (match && match[1] === "aeterna-question") {
        // Track unique question result for precision
        const questionId = btoa(encodeURIComponent(textContent.split('\n')[0].replace('Pregunta:', '').trim())).substring(0, 32);
        
        return (
          <AeternaInteractiveQuestion 
            content={textContent} 
            onResult={(correct: boolean) => {
              setSessionResults(prev => {
                if (prev.find(r => r.id === questionId)) return prev;
                return [...prev, { id: questionId, correct }];
              });
            }}
          />
        );
      }
      
      // Fallback
      if (markdownComponents.code) {
        return markdownComponents.code({ className, children, ...props });
      }
      return <code className={className} {...props}>{children}</code>;
    }
  };

  const headings = content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.replace("## ", "").trim();
      return { text, id: slugger.slug(text) };
    });

  const words = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / 225) || 1;

  // Pre-process markdown to convert custom blocks to code blocks
  let processedContent = content;

  const dedent = (text: string) => {
    const lines = text.split('\n');
    let minIndent = Infinity;
    for (const line of lines) {
      if (line.trim().length > 0) {
        const indent = line.match(/^[ \t]*/)?.[0].length || 0;
        minIndent = Math.min(minIndent, indent);
      }
    }
    if (minIndent === Infinity || minIndent === 0) return text;
    return lines.map(line => line.length >= minIndent ? line.substring(minIndent) : line).join('\n');
  };

  // Render Botones (we process innermost first)
  const BOTON_TYPES = ['BotonSimplificar', 'BotonProfundizar', 'BotonEjemplos', 'BotonConexiones'];
  BOTON_TYPES.forEach(type => {
    const regex = new RegExp(`<${type}>([\\s\\S]*?)<\\/${type}>`, 'g');
    processedContent = processedContent.replace(regex, (match, inner) => {
       return `\n\`\`\`aeterna-boton\n${btoa(encodeURIComponent(JSON.stringify({ type, content: dedent(inner) })))}\n\`\`\`\n`;
    });
  });

  // AccionBotones
  processedContent = processedContent.replace(/<AccionBotones>([\s\S]*?)<\/AccionBotones>/g, (match, inner) => {
    return `\n\`\`\`aeterna-accion-botones\n${btoa(encodeURIComponent(dedent(inner)))}\n\`\`\`\n`;
  });

  // AeternaDecisionBox handling when passed structurally
  processedContent = processedContent.replace(/<AeternaDecisionBox([\s\S]*?)(?<!<)\/>/g, (match, propsStr) => {
    // Parse question
    const qMatch = propsStr.match(/question=["']([^"']+)["']/);
    const question = qMatch ? qMatch[1] : '';
    
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
    options.forEach(opt => {
      newContent += `- ${opt}\n`;
    });
    if (options[correctIndex]) {
      newContent += `RespuestaCorrecta: ${options[correctIndex]}\n`;
    }
    
    return `\n\`\`\`aeterna-question\n${newContent}\n\`\`\`\n`;
  });

  // NivelContenido
  processedContent = processedContent.replace(/<NivelContenido([\s\S]*?)(?<!<)\/>/g, (match, inner) => {
    const levels: any = {};
    const regex = /(principiante|intermedio|avanzado)=\{\s*<>\n?([\s\S]*?)\n?\s*<\/>\s*\}/g;
    let m;
    while ((m = regex.exec(inner)) !== null) {
      levels[m[1]] = dedent(m[2]);
    }
    if (Object.keys(levels).length === 0) {
      const backupRegex = /(principiante|intermedio|avanzado)=\{([^}]*)\}/g;
      let m2;
      while ((m2 = backupRegex.exec(inner)) !== null) {
        levels[m2[1]] = dedent(m2[2].replace(/^\s*<>\n?/, '').replace(/\n?\s*<\/>\s*$/, ''));
      }
    }
    return `\n\`\`\`aeterna-nivel-contenido\n${btoa(encodeURIComponent(JSON.stringify(levels)))}\n\`\`\`\n`;
  });

  // NivelSelector
  processedContent = processedContent.replace(/<NivelSelector([\s\S]*?)(?<!<)\/>/g, (match, propsStr) => {
    let niveles = ["Principiante", "Intermedio", "Avanzado"];
    let nivelPorDefecto = "Intermedio";
    
    const nivelesMatch = propsStr.match(/niveles=\{([^}]+)\}/);
    if (nivelesMatch) {
      try {
        const arrStr = nivelesMatch[1].replace(/'/g, '"');
        niveles = JSON.parse(arrStr);
      } catch(e) {}
    }
    
    const defMatch = propsStr.match(/nivelPorDefecto=["']([^"']+)["']/);
    if (defMatch) {
      nivelPorDefecto = defMatch[1];
    }
    
    return `\n\`\`\`aeterna-nivel-selector\n${btoa(encodeURIComponent(JSON.stringify({ niveles, nivelPorDefecto })))}\n\`\`\`\n`;
  });

  processedContent = processedContent.replace(/::aeterna-question([\s\S]*?)::/g, (match, inner) => {
    return `\`\`\`aeterna-question\n${inner.trim()}\n\`\`\``;
  });
  
  processedContent = processedContent.replace(/::aeterna-decision([\s\S]*?)::/g, (match, inner) => {
    return `\`\`\`aeterna-decision\n${inner.trim()}\n\`\`\``;
  });

  processedContent = processedContent.replace(/::aeterna-equation([\s\S]*?)::/g, (match, inner) => {
    return `\`\`\`aeterna-equation\n${inner.trim()}\n\`\`\``;
  });

  // Pre-process practice problems for style
  if (data.tipo === "practice") {
    processedContent = processedContent.replace(/### ✅ Problema resuelto (.*?)\n([\s\S]*?)(?=\n### |\n## |\n---|\n\*\*Ejercicio|$)/g, (match, title, body) => {
      return `\`\`\`aeterna-practice\nTITLE: ${title.trim()}\n${body.trim()}\n\`\`\``;
    });
  }

  return (
    <div className="pb-32">
      {/* Progress Bar */}
        <motion.div
        className="fixed top-20 left-0 right-0 h-1 bg-brand-gold z-50 origin-left no-print"
        style={{ scaleX }}
      />

      {/* Modern Editorial Header */}
      <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-brand-ink">
        <motion.div 
          style={{ scale: imageScale, y: imageY }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover opacity-40 grayscale"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ opacity: headerOpacity, y: headerY }}
          >
            <div className="flex items-center justify-center gap-6 text-[9px] font-bold uppercase tracking-[0.4em] text-white/40 mb-12">
              <Link to="/" className="hover:text-brand-gold transition-colors">Archivo</Link>
              <div className="w-1 h-1 bg-brand-gold rounded-full"></div>
              <Link to={categoryLink} className="hover:text-brand-gold transition-colors">{categoryName}</Link>
              {subcategory && (
                <>
                  <div className="w-1 h-1 bg-brand-gold rounded-full"></div>
                  <span className="text-white/20">{subcategory.replace(/-/g, ' ')}</span>
                </>
              )}
            </div>
            
            <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl leading-[1] text-brand-offwhite mb-8">
              {data.title}
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="text-base sm:text-lg md:text-xl text-white/50 font-sans font-light max-w-2xl mx-auto tracking-wide leading-relaxed"
            >
              {data.description}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Meta Bar - Simplified Grid */}
      <section className="relative z-20 border-b border-brand-border bg-brand-offwhite no-print">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap border-x border-brand-border">
            <div className="flex-1 min-w-[200px] p-8 border-r border-brand-border flex items-center gap-6">
               <div className="flex flex-col">
                <span className="text-[9px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-2">Exégeta</span>
                <span className="text-[14px] font-medium text-brand-ink">{data.author}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px] p-8 border-r border-brand-border flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-2">Publicación</span>
                <span className="text-[14px] font-medium text-brand-ink">{formatDate(data.date)}</span>
              </div>
            </div>

            <div className="flex-1 min-w-[200px] p-8 border-r border-brand-border flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-2">Dimensión</span>
                <span className="text-[14px] font-medium text-brand-ink">{readTime} min / {words} palabras</span>
              </div>
            </div>

            <div className="p-8 flex items-center gap-4">
              <button className="p-2 hover:text-brand-blue transition-all duration-300 text-brand-muted"><Share2 className="h-4 w-4" /></button>
              <button onClick={() => window.print()} className="p-2 hover:text-brand-blue transition-all duration-300 text-brand-muted"><Printer className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 mt-12 md:mt-20 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Left Sidebar (Desktop Only) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 space-y-12">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-4">Contenido</h4>
              <nav className="text-sm space-y-3 font-medium">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="block opacity-70 transition-all hover:opacity-100 hover:text-brand-ink"
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
            
            <div className="pt-8 border-t border-brand-ink/5">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-4">Detalles</h4>
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-brand-ink/70">
                    <div className="w-8 h-8 rounded-full bg-brand-ink/5 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-brand-ink/70" />
                    </div>
                    <span><strong className="text-brand-ink">{readTime} min</strong> lectura</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-brand-ink/70">
                    <div className="w-8 h-8 rounded-full bg-brand-ink/5 flex items-center justify-center">
                      <Languages className="w-4 h-4 text-brand-ink/70" />
                    </div>
                    <span><strong className="text-brand-ink">{words}</strong> palabras</span>
                  </div>
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl mx-auto lg:mx-0 w-full flex flex-col bg-[#FAFAFA] sm:px-6 md:px-8 py-8 md:py-12 rounded-3xl mb-16 shadow-sm border border-brand-ink/5">
          {/* Mobile Inline TOC */}
          <div className="lg:hidden w-full mb-8 bg-zinc-50 border border-brand-ink/10 rounded-2xl overflow-hidden shadow-sm">
            <button 
              onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
              className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-brand-ink" />
                <span className="font-bold text-sm tracking-wide text-brand-ink uppercase">Contenido del artículo</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-brand-muted transition-transform duration-300 ${isMobileTocOpen ? '-rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isMobileTocOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-0 border-t border-brand-ink/5 bg-zinc-50">
                    <nav className="text-sm space-y-3 font-medium mt-4">
                      {headings.map((heading) => (
                        <a
                          key={`mobile-inline-${heading.id}`}
                          href={`#${heading.id}`}
                          onClick={() => setIsMobileTocOpen(false)}
                          className="block text-brand-muted hover:text-brand-ink transition-colors"
                        >
                          {heading.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <LevelProvider>
          <article className="w-full">
            {/* Article Reading Progression Bar */}
            {headings.length > 0 && (
              <div className="w-full max-w-3xl mx-auto mb-16 mt-4 font-sans no-print px-2 sticky top-[80px] z-40 bg-[#FAFAFA]/95 backdrop-blur-md pt-4 pb-6 border-b border-[#E5E0D8]/40">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#816520] truncate pr-4">
                    {currentStep?.title || article.data.title}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#816520] uppercase shrink-0">
                    {headings.findIndex(h => h.id === activeHeadingId) + 1} / {headings.length}
                  </span>
                </div>
                <div className="relative flex items-center h-4 py-2">
                  {/* Background Line */}
                  <div className="absolute left-0 right-0 h-[3px] bg-[#E5E0D8] z-0 rounded-full"></div>
                  
                  {/* Active Line */}
                  <div 
                    className="absolute left-0 h-[3px] bg-[#816520] z-0 transition-all duration-500 rounded-full" 
                    style={{ width: `${(Math.max(0, headings.findIndex(h => h.id === activeHeadingId)) / Math.max(1, headings.length - 1)) * 100}%` }}
                  ></div>
                  
                  {/* Nodes */}
                  <div className="absolute left-0 right-0 flex justify-between z-10 w-full px-[1px]">
                    {headings.map((heading, idx) => {
                      const activeIdx = headings.findIndex(h => h.id === activeHeadingId);
                      const isCurrent = idx === activeIdx;
                      const isPast = idx < activeIdx;

                      if (isCurrent) {
                        return (
                          <div key={heading.id} className="relative flex items-center justify-center w-4 h-4">
                             <div className="absolute inset-0 bg-[#816520] rounded-full blur-[4px] opacity-60"></div>
                             <div className="relative w-4 h-4 bg-[#FAFAFA] border-[3px] border-[#816520] rounded-full transition-all duration-300 scale-110"></div>
                          </div>
                        )
                      } else if (isPast) {
                        return (
                          <div key={heading.id} className="w-4 h-4 rounded-full bg-[#816520] border-2 border-[#816520] transition-colors duration-500"></div>
                        )
                      } else {
                         return (
                           <div key={heading.id} className="w-4 h-4 rounded-full border-[2px] border-[#D5D0C8] bg-[#FAFAFA]"></div>
                         )
                      }
                    })}
                  </div>
                </div>
                <div className="text-center mt-6">
                  <span className="font-serif text-sm tracking-wider text-[#816520] opacity-90 transition-all duration-300 drop-shadow-sm">
                    {headings.find(h => h.id === activeHeadingId)?.text || headings[0]?.text}
                  </span>
                </div>
              </div>
            )}

            <div className="markdown-body">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeSlug]}
              components={components}
            >
              {processedContent}
            </ReactMarkdown>
          </div>

          {currentStep && (
             <div className="mt-12 mb-16">
                {!isCompleted ? (
                  <div className="bg-brand-ink border border-brand-border p-8 text-center rounded-sm">
                     <BrainCircuit className="w-8 h-8 text-brand-gold mx-auto mb-4" />
                     <h4 className="font-serif text-2xl text-white mb-2">Completar Estudio</h4>
                     <p className="text-brand-muted text-sm mb-6">Marca este artículo como completado para desbloquear la prueba de dominio.</p>
                     <button
                        onClick={() => {
                          const words = article?.content.trim().split(/\s+/).length || 0;
                          completePath(`${currentCategory}.${currentStep.id}`, {
                            timeSpent: Date.now() - startTimeRef.current,
                            wordCount: words,
                            velocity: maxVelocityRef.current
                          });
                        }}
                        className="px-8 py-4 bg-brand-gold text-brand-ink text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                     >
                        Marcar como Leído
                     </button>
                  </div>
                ) : (
                  <div className="pt-8 border-t border-brand-border/30">
                    <AeternaExamTool 
                      levelNum={currentStep.level?.num || 1} 
                      levelTitle={currentStep.title} 
                      badgeName={currentStep.level?.badge || "Explorador"} 
                      categoryName={`${currentCategory}_${currentStep.id}`}
                      questions={ARTICLE_QUESTIONS[slug]}
                    />
                  </div>
                )}
             </div>
          )}

          <div className="mt-20 pt-10 border-t border-brand-ink/5">
            <div className="flex flex-wrap gap-2">
              {data.tags.map(tag => (
                <span key={tag} className="bg-brand-ink/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-ink/10 transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Engagement Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 border border-brand-border bg-white p-12 md:p-16 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-none pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-ink/5 rounded-none pointer-events-none" />
            
            <Lightbulb className="w-10 h-10 text-brand-gold mb-8 relative z-10" />
            <h3 className="font-serif text-3xl md:text-4xl mb-6 text-brand-ink tracking-tight relative z-10">Conclusión de la <span className="italic">Lectura</span></h3>
            <p className="text-brand-muted mb-10 max-w-sm relative z-10 text-sm md:text-base italic">
              ¿Ha resonado este conocimiento en su interior? Guarde este registro o comparta el hallazgo en su círculo.
            </p>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center gap-6 relative z-10">
               <button className="flex w-full sm:w-auto justify-center items-center gap-4 bg-brand-ink text-brand-offwhite px-10 py-4 hover:bg-brand-gold hover:text-white transition-all font-bold uppercase tracking-[0.2em] text-[10px] group">
                 <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 Compartir Registro
               </button>
               <button className="flex w-full sm:w-auto justify-center items-center gap-4 bg-white text-brand-ink border border-brand-ink px-10 py-4 hover:bg-zinc-50 transition-all font-bold uppercase tracking-[0.2em] text-[10px]">
                 <Bookmark className="w-4 h-4" />
                 Registrar Estudio
               </button>
            </div>
          </motion.div>

          {/* Author Section */}
          <div className="mt-12 md:mt-16 bg-white p-6 md:p-8 border border-brand-ink/5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start md:items-center text-center sm:text-left rounded-2xl shadow-sm">
             <div className="shrink-0 p-1 bg-white border border-brand-ink/10 shadow-sm rounded-full">
               <div className="h-16 w-16 md:h-14 md:w-14 bg-brand-ink/5 rounded-full overflow-hidden border-2 border-brand-gold">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${data.author}`} alt={data.author} className="w-full h-full object-cover" />
               </div>
             </div>
             <div>
               <h4 className="font-serif text-lg md:text-xl mb-1">{data.author}</h4>
               <p className="text-brand-muted text-xs md:text-sm leading-relaxed max-w-md">
                 Colaborador especializado en {data.category}. Comprometido con la difusión del conocimiento y la reflexión crítica.
               </p>
             </div>
          </div>
        </article>
        </LevelProvider>
        </div>
      </div>

      {/* JSON-LD for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "image": data.image,
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "datePublished": data.date,
          "category": data.category
        })}
      </script>
    </div>
  );
}
