import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, ChevronRight, Hash, Trophy, Sword, ShieldCheck, Zap, BrainCircuit, Activity } from 'lucide-react';
import { useGamification, formatXP } from '@/context/GamificationContext';
import { cn } from '@/lib/utils';

interface AeternaProps {
  content: string;
  onResult?: (correct: boolean) => void;
}

export function AeternaInteractiveQuestion({ content, onResult }: AeternaProps) {
  const { markQuestionAnswered, hasAnsweredQuestion } = useGamification();

  // Parsing
  const lines = content.split('\n');
  let questionText = '';
  let parsedOptions: string[] = [];
  let correctAnswerText = '';
  let xp = 50;
  let tipoText = 'VALIDACIÓN';
  let parsingOptions = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('Pregunta:')) {
      questionText = trimmed.replace('Pregunta:', '').trim();
      parsingOptions = false;
    } else if (trimmed.startsWith('Opciones:')) {
      parsingOptions = true;
    } else if (parsingOptions && trimmed.startsWith('-')) {
      parsedOptions.push(trimmed.replace('-', '').trim());
    } else if (trimmed.startsWith('RespuestaCorrecta:')) {
      correctAnswerText = trimmed.replace('RespuestaCorrecta:', '').trim();
      parsingOptions = false;
    } else if (trimmed.startsWith('XP:')) {
      xp = parseInt(trimmed.replace('XP:', '').trim()) || 50;
    } else if (trimmed.startsWith('Tipo:')) {
      tipoText = trimmed.replace('Tipo:', '').trim();
    }
  }

  const questionId = btoa(encodeURIComponent(questionText)).substring(0, 32);
  const isPreviouslyAnswered = hasAnsweredQuestion(questionId);
  const correctIndex = parsedOptions.findIndex(opt => opt === correctAnswerText);

  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">(isPreviouslyAnswered ? "correct" : "idle");
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSelect = (index: number) => {
    if (status !== "idle" || isPreviouslyAnswered) return;
    
    setSelected(index);
    const isCorrect = index === correctIndex;
    setStatus(isCorrect ? "correct" : "incorrect");
    
    if (onResult) onResult(isCorrect);
    
    if (isCorrect) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#8B6914', '#D4AF37', '#FDFBF7', '#1A1A1A']
      });
      markQuestionAnswered(questionId, xp, `Aeterna Quiz: ${tipoText}`);
    }
  };

  return (
    <div className="not-prose my-40 mx-auto max-w-5xl px-6 relative">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "relative overflow-hidden rounded-[4rem] border transition-all duration-1000 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]",
          status === 'idle' ? "bg-white border-[#d4af37]/20 hover:border-[#8B6914]/40" : 
          status === 'correct' ? "bg-[#FDFBF7] border-emerald-500/30" : "bg-white border-rose-500/30"
        )}
      >
        {/* Complex background artifacts */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B6914]/5 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        
        {/* Header Artifact */}
        <div className="relative z-10 px-12 pt-16 md:px-24 flex items-center justify-between">
           <div className="flex items-center gap-10">
              <div className={cn(
                "w-20 h-20 rounded-[2rem] flex items-center justify-center border shadow-xl transition-all duration-1000",
                status === 'correct' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white border-[#d4af37]/30"
              )}>
                 {status === 'correct' ? (
                   <ShieldCheck className="text-emerald-600 w-10 h-10" />
                 ) : (
                   <Activity className="text-[#8B6914] w-10 h-10 animate-pulse" />
                 )}
              </div>
              <div>
                 <span className="text-[11px] font-mono font-black uppercase tracking-[1em] text-[#8B6914] block mb-3 ml-[1em]">{tipoText}</span>
                 <div className="text-[10px] font-mono text-black/20 font-bold uppercase tracking-[0.4em]">Cámara de Verificación Axiomática</div>
              </div>
           </div>
           <div className="bg-white border border-[#d4af37]/30 px-8 py-4 rounded-[2rem] shadow-sm flex items-center gap-5 group hover:border-[#8B6914] transition-all">
              <Trophy className="w-5 h-5 text-[#8B6914] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-mono font-black text-black tracking-tighter">+{xp} XP</span>
           </div>
        </div>

        {/* Question Content */}
        <div className="relative z-10 px-12 md:px-24 py-20">
           <div className="flex gap-10 mb-20">
              <div className="w-1.5 h-32 bg-gradient-to-b from-[#8B6914] via-[#D4AF37]/40 to-transparent rounded-full hidden md:block" />
              <h3 className="font-serif text-4xl md:text-7xl text-[#1A1A1A] leading-tight tracking-tighter uppercase italic">
                 {questionText}
              </h3>
           </div>

           <div className="grid grid-cols-1 gap-8">
              {parsedOptions.map((option, idx) => {
                const isSelected = selected === idx;
                const isCorrect = idx === correctIndex;
                const showSuccess = (status !== 'idle' && isCorrect);
                const showError = (isSelected && status === 'incorrect');

                return (
                  <button
                    key={idx}
                    disabled={status !== 'idle'}
                    onClick={() => handleSelect(idx)}
                    className={cn(
                      "w-full group relative flex items-center gap-10 p-10 rounded-[3rem] border transition-all duration-700 text-left",
                      status === 'idle' ? "bg-white border-black/5 hover:border-[#8B6914]/40 hover:bg-[#8B6914]/[0.02] hover:translate-x-6 shadow-sm" : "cursor-default",
                      showSuccess ? "bg-emerald-50/50 border-emerald-500/30 translate-x-8 shadow-2xl shadow-emerald-500/10" : "",
                      showError ? "bg-rose-50/50 border-rose-500/30 animate-shake" : "",
                      !showSuccess && !showError && status !== 'idle' ? "opacity-20 blur-[4px] grayscale" : ""
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-xl font-black transition-all duration-1000 border relative shadow-inner",
                      showSuccess ? "bg-emerald-500 text-white border-emerald-500 shadow-xl" : 
                      showError ? "bg-rose-500 text-white border-rose-500" : "bg-white text-black/10 border-black/5 group-hover:bg-[#1A1A1A] group-hover:text-[#D4AF37] group-hover:border-black"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={cn(
                      "flex-1 text-[22px] md:text-[26px] tracking-tight leading-relaxed font-serif",
                      showSuccess ? "text-emerald-950 font-bold" : "text-[#3E2C23] font-light"
                    )}>
                      {option}
                    </span>
                    {showSuccess && (
                      <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="shrink-0 bg-emerald-500 rounded-full p-2 shadow-lg">
                         <CheckCircle2 className="text-white w-10 h-10" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
           </div>
        </div>

        {/* Status Message */}
        <AnimatePresence>
           {status !== 'idle' && (
             <motion.div
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               className="relative z-10 bg-black/[0.03] border-t border-[#d4af37]/10 px-12 md:px-24 py-14"
             >
                <div className="flex items-center justify-between w-full">
                   <div className="flex items-center gap-10">
                      <div className={cn("w-4 h-4 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)]", status === 'correct' ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                      <div className="flex flex-col gap-1">
                         <p className="text-[12px] font-mono font-black uppercase tracking-[0.8em] text-black/80">
                            {status === 'correct' ? "Sincronización Exitosa" : "Error de Integridad"}
                         </p>
                         <p className="text-[10px] font-mono text-black/30 uppercase tracking-[0.4em]">
                            {status === 'correct' ? "La Gnosis ha sido asimilada permanentemente." : "Exégesis fallida: Reintento de proceso requerido."}
                         </p>
                      </div>
                   </div>
                   {status === 'correct' && (
                     <div className="flex items-center gap-5 bg-white px-8 py-4 rounded-full border border-[#d4af37]/30 shadow-md">
                        <BrainCircuit size={20} className="text-[#8B6914] animate-pulse" />
                        <span className="text-[10px] font-mono font-black text-black/60 uppercase tracking-[0.6em]">Estado: Trascendido</span>
                     </div>
                   )}
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </motion.div>
      
      {/* Absolute side artifacts */}
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-64 bg-gradient-to-b from-transparent via-[#d4af37]/20 to-transparent rounded-full" />
    </div>
  );
}
