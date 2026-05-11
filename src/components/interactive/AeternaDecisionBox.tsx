import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Zap, BookOpen, PenTool, Hourglass, Feather, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { useGamification, calculateProgressToNextLevel } from '@/context/GamificationContext';

export interface AeternaDecisionBoxProps {
  id?: string;
  badgeText?: string;
  title?: string;
  question?: string;
  levelRequired?: number;
  xp?: number;
  buttonText?: string;
  completedText?: string;
  onDecision?: () => void;
  className?: string;
  content?: string; 
}

export function AeternaDecisionBox({
  id,
  badgeText = "Fragmento de Destino",
  title = "",
  question,
  levelRequired = 0,
  xp = 50,
  buttonText = "Aceptar Destino",
  completedText = "Decisión Sellada",
  onDecision,
  className,
  content
}: AeternaDecisionBoxProps) {
  const { progress, markQuestionAnswered, hasAnsweredQuestion } = useGamification();
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [textValue, setTextValue] = useState("");
  
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#BA8B4A', '#FBFBF9'] 
    });
  };
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    const handleMouseLeave = () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    };
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    let particles: any[] = [];
    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; fadeSpeed: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.6 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.15;
        this.fadeSpeed = Math.random() * 0.006 + 0.002;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY; this.opacity += this.fadeSpeed;
        if (this.opacity >= 0.6 || this.opacity <= 0.08) this.fadeSpeed *= -1;
        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }
      draw() {
        if (!ctx) return; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 134, 11, ${this.opacity})`; ctx.shadowBlur = 7;
        ctx.shadowColor = `rgba(184, 134, 11, ${this.opacity * 0.7})`; ctx.fill();
      }
    }
    for (let i = 0; i < 40; i++) particles.push(new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resizeCanvas); };
  }, []);
  
  let finalBadge = badgeText;
  let finalTitle = title;
  let finalQuestion = question || "";
  let finalLevel = levelRequired;
  let finalXp = xp;
  let finalButton = buttonText;

  if (content) {
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('Badge:')) finalBadge = trimmed.replace('Badge:', '').trim();
      else if (trimmed.startsWith('Título:')) finalTitle = trimmed.replace('Título:', '').trim();
      else if (trimmed.startsWith('Pregunta:')) finalQuestion = trimmed.replace('Pregunta:', '').trim();
      else if (trimmed.startsWith('Nivel:')) finalLevel = parseInt(trimmed.replace('Nivel:', '').trim()) || 0;
      else if (trimmed.startsWith('XP:')) finalXp = parseInt(trimmed.replace('XP:', '').trim()) || 50;
      else if (trimmed.startsWith('Botón:')) finalButton = trimmed.replace('Botón:', '').trim();
    }
  }

  const definitiveId = id || btoa(encodeURIComponent(finalQuestion)).substring(0, 32);
  const isCompleted = hasAnsweredQuestion(definitiveId);
  const currentLevelStat = calculateProgressToNextLevel(progress.xp);
  const userLevel = currentLevelStat.level;
  const isLocked = userLevel < finalLevel;

  const handleDecision = () => {
    if (isLocked || isCompleted || !textValue.trim()) return;
    setShowRewardAnimation(true);
    triggerConfetti();
    markQuestionAnswered(definitiveId, finalXp, `Reflexión: ${finalBadge}`);
    setTimeout(() => setShowRewardAnimation(false), 4000);
    if (onDecision) onDecision();
  };

  return (
    <div className={cn("not-prose relative my-24 mx-auto max-w-2xl", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-40 rounded-[2rem]" style={{ width: '100%', height: '100%' }} />

      <div ref={cardRef} className={cn(
        "relative z-10 bg-[#fefcf5] border border-[#d4af37]/40 rounded-[2rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.2),0_0_0_1px_rgba(212,175,55,0.15)] transition-all duration-700 overflow-hidden flex flex-col p-10 md:p-16",
        !isCompleted && "hover:shadow-[0_40px_80px_-22px_rgba(0,0,0,0.25),0_0_30px_rgba(212,175,55,0.2)]",
        isCompleted && "opacity-95 grayscale-[0.1]"
      )}>
        {/* Abstract pattern background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="relative z-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
               <div className={cn(
                 "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-all duration-700",
                 isCompleted ? "bg-emerald-500/10 border-emerald-500/20" : "bg-black/[0.02] border-black/5"
               )}>
                  {isCompleted ? <ShieldCheck className="text-emerald-600 w-7 h-7" /> : <Sparkles className="text-[#8B6914] w-7 h-7" />}
               </div>
               <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-[#8B6914] block mb-1">{finalBadge}</span>
                  <div className="text-[11px] font-mono text-black/30 uppercase tracking-[0.2em]">{isCompleted ? 'Estado: Sincronizado' : `Fragmento de Destino (+${finalXp} XP)`}</div>
               </div>
            </div>
            {isLocked && (
              <div className="px-5 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                 <Lock size={12} /> Requiere Nivel {finalLevel}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] leading-tight tracking-tight uppercase">{finalQuestion || "Reflexión Aeterna"}</h2>
            {finalTitle && (
              <div className="flex gap-6 items-start bg-black/[0.01] p-6 rounded-2xl border border-black/5 shadow-inner">
                 <div className="w-1 h-12 bg-[#8B6914]/20 rounded-full mt-1" />
                 <p className="text-[#3E2C23] font-serif text-xl leading-relaxed italic">{finalTitle}</p>
              </div>
            )}
          </div>

          {!isCompleted ? (
            <div className="relative group">
               <textarea 
                 value={textValue}
                 onChange={(e) => setTextValue(e.target.value)}
                 className="w-full bg-[#fefcf5] border border-black/10 rounded-[1.5rem] p-8 text-[#1A1A1A] placeholder:text-black/20 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50 min-h-[180px] resize-none transition-all text-lg font-light leading-relaxed disabled:opacity-30 shadow-inner"
                 placeholder={isLocked ? `Desbloquea el Nivel ${finalLevel} para procesar este fragmento` : "Expresa tu exégesis aquí..."}
                 disabled={isCompleted || isLocked}
               />
               <div className="absolute bottom-6 right-8 text-[9px] font-mono font-black text-black/10 uppercase tracking-[0.3em]">Cámara de Integridad</div>
            </div>
          ) : (
            <div className="bg-black/[0.02] border border-black/5 rounded-[1.5rem] p-8 italic text-[#1A1A1A]/40 text-xl font-light leading-relaxed text-center">
               "Su exégesis ha sido grabada en el Registro de la Gnosis Permanente."
            </div>
          )}

          <div className="flex justify-center mt-4">
            {!isCompleted ? (
              <button
                onClick={handleDecision}
                disabled={isLocked || !textValue.trim()}
                className={cn(
                  "group relative overflow-hidden rounded-xl bg-[#1A1A1A] px-12 py-5 text-[11px] font-black uppercase tracking-[0.5em] text-white transition-all hover:bg-[#8B6914] active:scale-95 disabled:opacity-20",
                  !isLocked && "shadow-2xl shadow-[#8B6914]/20"
                )}
              >
                <span className="relative z-10 flex items-center gap-4">{finalButton} <ArrowRight size={16} /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                 <div className="px-10 py-4 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                   <ShieldCheck size={14} /> {completedText}
                 </div>
              </div>
            )}
          </div>
        </div>

        {isLocked && !isCompleted && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/50 backdrop-blur-sm pointer-events-none" />
        )}

        <AnimatePresence>
          {showRewardAnimation && (
            <motion.div
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{ y: -150, opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 2, type: 'spring' }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-serif font-black text-[#8B6914] drop-shadow-2xl z-50 pointer-events-none whitespace-nowrap"
            >
              <span className="text-[#D4AF37]">+</span>{finalXp} XP
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
