import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Lightbulb, ArrowRight, Target, ShieldCheck, PenTool, BrainCircuit, ChevronRight, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import { useGamification } from '@/context/GamificationContext';

interface AeternaExerciseProps {
  content: string;
}

export function AeternaExercise({ content }: AeternaExerciseProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const [answerContent, setAnswerContent] = useState("");
  const [showHint, setShowHint] = useState(false);
  
  // Parsing: TITLE, HINT, XP, and Content
  const lines = content.split('\n');
  let label = "Ejercicio de Aplicación";
  let textBody = "";
  let pista = "";
  let xp = 50;

  lines.forEach(line => {
    if (line.startsWith('TITLE:')) label = line.replace('TITLE:', '').trim();
    else if (line.startsWith('HINT:')) pista = line.replace('HINT:', '').trim();
    else if (line.startsWith('XP:')) xp = parseInt(line.replace('XP:', '').trim()) || 50;
    else if (line.trim() && !line.startsWith('TITLE:') && !line.startsWith('HINT:') && !line.startsWith('XP:')) {
      textBody += line + '\n';
    }
  });

  const exerciseId = btoa(encodeURIComponent(textBody.substring(0, 50))).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(exerciseId);

  const handleCheckAnswer = () => {
    if (isCompleted || !answerContent.trim()) return;
    markQuestionAnswered(exerciseId, xp, `Ejercicio: ${label}`);
  };

  const markdownComponents = {
    p: ({ children }: any) => <p className="mb-6 text-[#3E2C23]/80 leading-relaxed font-normal text-xl">{children}</p>,
    code: ({ children }: any) => <code className="bg-[#8B6914]/5 text-[#8B6914] px-2 py-0.5 rounded font-mono text-sm border border-[#8B6914]/10">{children}</code>
  };

  return (
    <div className="not-prose my-32 mx-auto max-w-4xl px-4 relative">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "bg-[#FDFBF7] border border-[#d4af37]/40 rounded-[3rem] p-12 md:p-24 overflow-hidden transition-all duration-1000 shadow-2xl relative",
          isCompleted ? "opacity-95" : "hover:border-[#8B6914]/40"
        )}
      >
        {/* Subtle background artifacts */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

        <header className="mb-20 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
           <div className="flex items-center gap-8">
              <div className={cn(
                "w-20 h-20 rounded-[2rem] flex items-center justify-center border shadow-xl transition-all duration-1000 bg-white group",
                isCompleted ? "bg-emerald-50 border-emerald-500/20" : "border-[#d4af37]/30"
              )}>
                 {isCompleted ? (
                   <ShieldCheck className="text-emerald-600 w-10 h-10" />
                 ) : (
                   <div className="relative">
                      <Target className="text-[#8B6914] w-10 h-10 group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] rounded-full animate-ping" />
                   </div>
                 )}
              </div>
              <div>
                 <span className="text-[10px] font-mono font-black uppercase tracking-[0.8em] text-[#8B6914] block mb-3 opacity-60">Práctica de Alta Fidelidad</span>
                 <h3 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] tracking-tighter uppercase leading-tight">{label}</h3>
              </div>
           </div>
           {!isCompleted && (
             <div className="bg-white border border-[#d4af37]/30 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-4 group hover:border-[#8B6914] transition-all">
                <BrainCircuit className="w-5 h-5 text-[#8B6914]" />
                <span className="text-xs font-mono font-black text-black tracking-tighter">+{xp} XP</span>
             </div>
           )}
        </header>

        <div className="prose max-w-none mb-20 text-2xl italic text-[#3E2C23]/60 leading-relaxed border-l-4 border-[#d4af37]/20 pl-12 relative z-10 font-serif">
           <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>{textBody}</ReactMarkdown>
        </div>

        <div className="space-y-12 relative z-10">
           {!isCompleted ? (
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 to-transparent rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
                 <textarea 
                   value={answerContent}
                   onChange={(e) => setAnswerContent(e.target.value)}
                   className="relative w-full bg-white border border-black/10 rounded-[2rem] p-12 text-[#1A1A1A] placeholder:text-black/10 focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/60 min-h-[250px] resize-none transition-all text-xl font-light leading-relaxed disabled:opacity-30 shadow-inner"
                   placeholder="Canaliza tu resolución razonada aquí..."
                   disabled={isCompleted}
                 />
                 <div className="absolute bottom-8 right-10 flex items-center gap-3 text-[10px] font-mono font-black text-black/10 uppercase tracking-[0.4em]">
                    <PenTool size={14} /> Registro Táctico
                 </div>
              </div>
           ) : (
             <div className="bg-[#fefcf5] border border-[#d4af37]/20 rounded-[2rem] p-12 italic text-[#1A1A1A]/40 text-2xl font-light leading-relaxed text-center shadow-inner">
                "Su exégesis técnica ha sido validada y almacenada en la Cámara de Maestría."
             </div>
           )}

           <div className="flex flex-col sm:flex-row gap-10 justify-between items-center px-4">
              <button 
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-4 text-[11px] font-mono font-black uppercase tracking-[0.5em] text-black/30 hover:text-[#8B6914] transition-all group"
              >
                <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:border-[#8B6914]/20 transition-all shadow-sm">
                   <Lightbulb size={18} className="group-hover:text-amber-500 transition-colors" />
                </div>
                {showHint ? 'Cerrar Guía' : 'Invocar Pista'}
              </button>

              {!isCompleted ? (
                <button 
                  onClick={handleCheckAnswer}
                  disabled={isCompleted || !answerContent.trim()}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl px-20 py-8 text-[12px] font-black uppercase tracking-[0.6em] transition-all shadow-2xl bg-[#1A1A1A] text-white hover:bg-[#8B6914] active:scale-95",
                    !answerContent.trim() && "opacity-20"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-6">Sellar Resolución <Zap size={18} /></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              ) : (
                <div className="flex items-center gap-6">
                   <div className="px-12 py-5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-black uppercase tracking-[0.5em] flex items-center gap-4 shadow-sm">
                      <ShieldCheck size={18} /> Sincronización Completa
                   </div>
                   <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-[#8B6914] hover:text-black transition-colors">
                      <ChevronRight size={24} className="rotate-[-90deg]" />
                   </button>
                </div>
              )}
           </div>

           <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="overflow-hidden"
                >
                   <div className="p-10 bg-[#8B6914]/5 border-l-4 border-[#8B6914] rounded-r-[2rem] text-xl text-[#8B6914]/80 italic leading-relaxed shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                         <span className="text-[#8B6914] font-black uppercase tracking-[0.6em] text-[11px]">Guía de Exégesis Técnica</span>
                         <div className="h-px flex-1 bg-[#8B6914]/10" />
                      </div>
                      {pista}
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
