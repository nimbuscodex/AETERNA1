import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Zap, BookOpen, PenTool, Hourglass, Feather, CheckCircle2 } from 'lucide-react';
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
  content?: string; // For Markdown parsing
}

export function AeternaDecisionBox({
  id,
  badgeText = "Lectura Aeterna",
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
  const { progress, markQuestionAnswered, hasAnsweredQuestion, addXP } = useGamification();
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#BA8B4A', '#FBFBF9'] // Gold colors
    });
  };
  
  // 3D tilt effect on hover
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

  // Golden particles effect
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
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;

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
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fadeSpeed;
        if (this.opacity >= 0.6 || this.opacity <= 0.08) this.fadeSpeed *= -1;
        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 134, 11, ${this.opacity})`;
        ctx.shadowBlur = 7;
        ctx.shadowColor = `rgba(184, 134, 11, ${this.opacity * 0.7})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", resizeCanvas);
    };
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

  const [textValue, setTextValue] = useState("");

  const handleDecision = () => {
    if (isLocked || isCompleted) return;
    
    setShowRewardAnimation(true);
    triggerConfetti();
    markQuestionAnswered(definitiveId, finalXp, `Reflexión: ${finalTitle || finalQuestion.substring(0, 20)}`);
    
    setTimeout(() => {
      setShowRewardAnimation(false);
    }, 4000);
    
    if (onDecision) {
      onDecision();
    }
  };

  return (
    <div className={cn("not-prose relative my-8 mx-auto max-w-lg", className)}>
      {/* Particle background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-60 rounded-xl" style={{ width: '100%', height: '100%' }} />

      <div ref={cardRef} className={cn(
        "relative z-10 bg-[#fefcf5] border border-[#d4af37]/55 rounded-lg shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(212,175,55,0.25),inset_0_1px_0_rgba(255,255,240,0.9),inset_0_-1px_0_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out overflow-hidden flex flex-col",
        !isCompleted && "hover:shadow-[0_25px_50px_-22px_rgba(0,0,0,0.2),0_0_20px_rgba(212,175,55,0.25),0_0_0_2px_rgba(212,175,55,0.4),inset_0_1px_0_rgba(255,255,240,1),inset_0_-1px_0_rgba(0,0,0,0.1)]",
        isCompleted && "opacity-95 grayscale-[0.2]"
      )}>
        {/* Left binding edge */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-[rgba(184,134,11,0.5)] via-[rgba(212,175,55,0.3)] to-transparent border-r border-[#d4af37]/65 shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-[5]" />

        {/* Logo */}
        <div className="absolute top-4 left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded border border-[#d4af37]/50 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12),0_0_0_1px_rgba(212,175,55,0.4)] transition-shadow">
          <div className="w-5 h-5 rounded-full bg-[radial-gradient(circle,#E8C44A,#B8860B)] shadow-[0_0_8px_rgba(212,175,55,0.5)] flex items-center justify-center font-['Cinzel'] font-bold text-[10px] text-[#1a1a16] font-serif">A</div>
          <span className="font-['Cinzel'] font-semibold text-[10px] tracking-[0.18em] text-[#8B6914] uppercase font-serif">Aeterna</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-end px-6 py-4 border-b border-[#d4af37]/30 ml-8">
          <span className="text-[0.55rem] tracking-[0.15em] text-[#8B6F42] uppercase bg-[#d4af37]/12 px-2.5 py-1 rounded border border-[#d4af37]/40 mr-3 font-medium">{finalBadge}</span>
          <div className="font-['Cinzel'] text-xs text-[#5C4A2E] tracking-[0.1em] font-serif flex items-center">
             XP <strong className="text-[#8B6914] text-base ml-1.5">{finalXp}</strong>
          </div>
        </div>

        {/* Progress Bar (Visual flair for answering state) */}
        <div className="mx-6 h-[2px] bg-[#d4af37]/20 rounded ml-8">
          <div
            className="h-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#E8C44A] shadow-[0_0_6px_rgba(212,175,55,0.5)] rounded transition-all duration-1000"
            style={{ width: isCompleted ? '100%' : '10%' }}
          />
        </div>

        <div className="px-5 sm:px-6 py-4 relative z-10 flex flex-col gap-3 ml-2">
          {/* Question Text */}
          <h2 className="font-['Cinzel'] text-sm sm:text-base font-semibold leading-relaxed text-[#2E2416] tracking-wide font-serif mb-1">
            {finalQuestion}
          </h2>

          {/* Title box if exists */}
          {finalTitle && (
            <div className="bg-[#fffef9] border border-[#d4af37]/35 rounded-lg p-4 sm:p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)] relative overflow-hidden">
               <p className="text-[#3E2C23] font-serif text-[15px] md:text-base leading-relaxed relative z-10">
                {finalTitle}
               </p>
            </div>
          )}
          
          <div className="relative mt-2">
             <textarea 
               value={textValue}
               onChange={(e) => setTextValue(e.target.value)}
               className="w-full bg-[#fefcf5] border border-[#d4af37]/30 rounded-lg p-4 text-[#3E2C23] placeholder:text-[#3E2C23]/40 focus:outline-none focus:border-[#d4af37]/70 focus:ring-1 focus:ring-[#d4af37]/70 min-h-[120px] resize-y disabled:opacity-60 disabled:bg-[#f3f0e6] disabled:cursor-not-allowed"
               placeholder={isLocked ? `Desbloquea el Nivel ${finalLevel} para reflexionar sobre esto` : "Escribe tu reflexión aquí..."}
               disabled={isCompleted || isLocked}
             ></textarea>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 p-4 rounded-lg border border-[#d4af37]/20 bg-[#d4af37]/5">
            {!isCompleted ? (
              <button
                onClick={handleDecision}
                disabled={isLocked}
                className={cn(
                  "w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#E8C44A] text-[#2E2416] rounded px-6 py-2.5 font-sans font-black tracking-[0.2em] uppercase text-[10px] sm:text-xs transition-all shadow-[0_2px_10px_rgba(212,175,55,0.3)]",
                  isLocked ? "opacity-50 grayscale cursor-not-allowed" : "hover:shadow-[0_4px_15px_rgba(212,175,55,0.5)] hover:-translate-y-0.5 active:scale-95 border border-[#fff4cc]"
                )}
              >
                {finalButton}
              </button>
            ) : (
              <span className="text-[#1B5E20] font-serif italic text-base sm:text-lg font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {completedText}
              </span>
            )}
          </div>
        </div>

        {/* Locked Overlay */}
        <AnimatePresence>
          {isLocked && !isCompleted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-2xl"
            >
              <div className="bg-[#fefcf5] border border-[#d4af37]/40 p-8 rounded-xl flex flex-col items-center text-center w-[90%] max-w-[420px] shadow-[0_10px_40px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                
                <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/40 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)] relative z-10 backdrop-blur-md">
                  <Lock className="w-8 h-8 text-[#8B6914] drop-shadow-sm" />
                </div>
                
                <h5 className="text-[#2E2416] font-serif font-semibold text-xl sm:text-2xl mb-3 relative z-10 tracking-wide">
                  Vínculo Insuficiente
                </h5>
                <p className="text-[#5C4336] text-sm sm:text-base mb-8 font-serif leading-relaxed relative z-10 w-[90%] mx-auto">
                  Requiere <strong className="text-[#8B6914]">Nivel {finalLevel}</strong> para acceder a este portal de conocimiento.
                </p>
                
                <div className="w-full relative z-10 bg-white border border-[#d4af37]/20 p-4 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between text-xs text-[#8B6914] mb-3 font-sans uppercase tracking-[0.2em] px-1 font-bold">
                    <span className="opacity-70">NV {userLevel}</span>
                    <span className="text-[#8B6914]">NV {finalLevel}</span>
                  </div>
                  <div className="w-full bg-[#f4ebd0] h-3 rounded-full overflow-hidden shadow-inner border border-[#d4af37]/30">
                    <motion.div 
                      className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#E8C44A] h-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                      style={{ width: `${Math.min(100, (currentLevelStat.currentLevelXp / currentLevelStat.xpForNextLevel) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Gaming Effect: Floating XP indicator */}
        <AnimatePresence>
          {showRewardAnimation && (
            <motion.div
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{ y: -150, opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 2, type: 'spring' }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-serif font-bold text-[#8B6914] drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] z-50 pointer-events-none whitespace-nowrap"
            >
              <span className="text-[#D4AF37]">+</span>{finalXp} XP
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
