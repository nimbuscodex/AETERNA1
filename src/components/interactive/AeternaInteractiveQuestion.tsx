import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useGamification, formatXP } from '@/context/GamificationContext';

interface AeternaProps {
  content: string;
  onResult?: (correct: boolean) => void;
}

export function AeternaInteractiveQuestion({ content, onResult }: AeternaProps) {
  const { addXP, markQuestionAnswered, hasAnsweredQuestion, progress: gamificationProgress } = useGamification();

  // Parse lines to extract question, options, correct answer, etc.
  const lines = content.split('\n');
  let questionText = '';
  let parsedOptions: string[] = [];
  let correctAnswerText = '';
  let xp = 20;
  let tipoText = 'Decisión';

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
      xp = parseInt(trimmed.replace('XP:', '').trim()) || 20;
      parsingOptions = false;
    } else if (trimmed.startsWith('Tipo:')) {
      tipoText = trimmed.replace('Tipo:', '').trim();
      parsingOptions = false;
    }
  }

  const questionId = btoa(encodeURIComponent(questionText)).substring(0, 32);
  const isPreviouslyAnswered = hasAnsweredQuestion(questionId);

  const options = parsedOptions.map((opt, index) => ({
    id: index,
    text: opt
  }));
  const correctIndex = parsedOptions.findIndex(opt => opt === correctAnswerText);

  // States
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">(isPreviouslyAnswered ? "correct" : "idle");
  const [revealCorrect, setRevealCorrect] = useState(isPreviouslyAnswered);
  const [hasCollectedXP, setHasCollectedXP] = useState(isPreviouslyAnswered);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isPreviouslyAnswered && correctIndex !== -1) {
      setSelected(correctIndex);
      setStatus("correct");
      setRevealCorrect(true);
      setHasCollectedXP(true);
    }
  }, [isPreviouslyAnswered, correctIndex]);

  // Handle selection
  const handleSelect = (index: number) => {
    if (status !== "idle" || isPreviouslyAnswered) return;
    
    setSelected(index);
    const isCorrect = index === correctIndex;
    setStatus(isCorrect ? "correct" : "incorrect");
    
    if (onResult) {
      onResult(isCorrect);
    }
    
    if (isCorrect && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x, y },
        colors: ['#D4AF37', '#FACC15', '#B8860B'],
        disableForReducedMotion: true,
        zIndex: 100
      });
    }
    
    setTimeout(() => setRevealCorrect(true), 400);
  };

  const handleCollectXP = () => {
    if (hasCollectedXP) return;
    setHasCollectedXP(true);
    markQuestionAnswered(questionId, status === 'correct' ? xp : Math.max(5, Math.floor(xp / 2)), `Pregunta Respondida`);
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
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
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
    let particles: Particle[] = [];

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

    for (let i = 0; i < 60; i++) {
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

  const getOptionState = (optionId: number) => {
    if (status === "idle") return "idle";
    if (selected === optionId && status === "correct") return "correct";
    if (selected === optionId && status === "incorrect") return "incorrect";
    if (optionId === correctIndex && revealCorrect) return "revealed";
    return "idle";
  };

  return (
    <div className="not-prose relative my-8 mx-auto max-w-lg">
      {/* Particle background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-60 rounded-xl" style={{ width: '100%', height: '100%' }} />

      <div ref={cardRef} className="relative z-10 bg-[#fefcf5] border border-[#d4af37]/55 rounded-lg shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(212,175,55,0.25),inset_0_1px_0_rgba(255,255,240,0.9),inset_0_-1px_0_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-22px_rgba(0,0,0,0.2),0_0_20px_rgba(212,175,55,0.25),0_0_0_2px_rgba(212,175,55,0.4),inset_0_1px_0_rgba(255,255,240,1),inset_0_-1px_0_rgba(0,0,0,0.1)] transition-transform duration-200 ease-out overflow-hidden"
      >
        {/* Left binding edge */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-[rgba(184,134,11,0.5)] via-[rgba(212,175,55,0.3)] to-transparent border-r border-[#d4af37]/65 shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-[5]" />

        {/* Logo */}
        <div className="absolute top-4 left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded border border-[#d4af37]/50 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12),0_0_0_1px_rgba(212,175,55,0.4)] transition-shadow">
          <div className="w-5 h-5 rounded-full bg-[radial-gradient(circle,#E8C44A,#B8860B)] shadow-[0_0_8px_rgba(212,175,55,0.5)] flex items-center justify-center font-['Cinzel'] font-bold text-[10px] text-[#1a1a16] font-serif">A</div>
          <span className="font-['Cinzel'] font-semibold text-[10px] tracking-[0.18em] text-[#8B6914] uppercase font-serif">Aeterna</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-end px-6 py-4 border-b border-[#d4af37]/30 ml-8">
          <span className="text-[0.55rem] tracking-[0.15em] text-[#8B6F42] uppercase bg-[#d4af37]/12 px-2.5 py-1 rounded border border-[#d4af37]/40 mr-3 font-medium">{tipoText}</span>
          <div className="font-['Cinzel'] text-xs text-[#5C4A2E] tracking-[0.1em] font-serif flex items-center">
             XP <strong className="text-[#8B6914] text-base ml-1.5">{formatXP(xp)}</strong>
          </div>
        </div>

        {/* Progress Bar (Visual flair for answering state) */}
        <div className="mx-6 h-[2px] bg-[#d4af37]/20 rounded ml-8">
          <div
            className="h-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#E8C44A] shadow-[0_0_6px_rgba(212,175,55,0.5)] rounded transition-all duration-1000"
            style={{ width: `${status === "correct" ? 100 : status === "incorrect" ? 50 : 10}%` }}
          />
        </div>

        {/* Question */}
        <div className="px-5 sm:px-6 py-4 ml-2">
          <h2 className="font-['Cinzel'] text-sm sm:text-base font-semibold leading-relaxed text-[#2E2416] tracking-wide font-serif">
            {questionText}
          </h2>
        </div>

        {/* Options */}
        <div className="px-6 sm:px-8 pb-6 ml-2 space-y-3">
          {options.map((option) => {
            const state = getOptionState(option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={status !== "idle"}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left border rounded-lg transition-all duration-300 ease-out
                  ${state === "idle" ? "bg-[#fffef9] border-[#b8860b]/35 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.8)] hover:border-[#b8860b]/70 hover:bg-[#fefcf3] hover:shadow-[0_6px_15px_rgba(184,134,11,0.12),inset_0_0_0_1px_rgba(255,255,255,1)] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0" : ""}
                  ${state === "correct" ? "border-[#3D8B40] bg-[#f2faf2] shadow-[0_4px_15px_rgba(76,175,80,0.15),inset_0_0_0_1px_rgba(255,255,255,0.9)]" : ""}
                  ${state === "incorrect" ? "border-[#C62828] bg-[#fdf4f2] shadow-[0_4px_15px_rgba(244,67,54,0.12),inset_0_0_0_1px_rgba(255,255,255,0.9)] animate-[shake_0.4s_ease]" : ""}
                  ${state === "revealed" ? "border-[#3D8B40] bg-[#f7fcf7] shadow-[0_3px_10px_rgba(76,175,80,0.1),inset_0_0_0_1px_rgba(255,255,255,0.9)]" : ""}
                  ${status !== "idle" ? "opacity-85 cursor-default" : "cursor-pointer"}
                `}
              >
                {/* Sigil Box */}
                <span className={`
                  shrink-0 w-7 h-7 flex items-center justify-center rounded font-['Cinzel'] font-bold text-sm transition-all font-serif
                  ${state === "idle" ? "bg-[#b8860b]/10 border border-[#b8860b]/30 text-[#8B6914]" : ""}
                  ${state === "correct" ? "bg-[#e8f5e9] border-[#4CAF50] text-[#2E7D32] shadow-[0_0_8px_rgba(76,175,80,0.4)]" : ""}
                  ${state === "incorrect" ? "bg-[#ffebee] border-[#F44336] text-[#C62828] shadow-[0_0_8px_rgba(244,67,54,0.4)]" : ""}
                  ${state === "revealed" ? "bg-[#e8f5e9] border-[#4CAF50] text-[#2E7D32] shadow-[0_0_6px_rgba(76,175,80,0.3)]" : ""}
                `}>
                  {String.fromCharCode(65 + option.id)}
                </span>

                {/* Option Text */}
                <span className={`
                  flex-1 text-sm sm:text-[15px] tracking-wide transition-colors
                  ${state === "idle" ? "text-[#3E2C23]" : ""}
                  ${state === "correct" ? "text-[#1B5E20] font-medium" : ""}
                  ${state === "incorrect" ? "text-[#B71C1C]" : ""}
                  ${state === "revealed" ? "text-[#2E7D32] font-medium" : ""}
                `}>
                  {option.text}
                </span>

                {/* Feedback Icons */}
                <div className="shrink-0 flex items-center justify-center">
                    {state === "correct" && (
                    <svg className="w-4 h-4 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    )}
                    {state === "incorrect" && (
                    <svg className="w-4 h-4 text-[#C62828]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    )}
                    {state === "revealed" && (
                    <svg className="w-4 h-4 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Result Message Area */}
        {status !== "idle" && (
          <div className="px-6 sm:px-8 pb-6 ml-2 mt-1 transition-all duration-500 transform translate-y-0 opacity-100">
            <div className={`px-5 py-4 rounded-lg border flex items-start gap-3 ${status === "correct" ? "bg-[#f2faf2] border-[#4CAF50]/40 shadow-[0_4px_10px_rgba(76,175,80,0.08)]" : "bg-[#fdf4f2] border-[#F44336]/40 shadow-[0_4px_10px_rgba(244,67,54,0.08)]"}`}>
              <div className="flex-shrink-0 mt-0.5">
                {status === "correct" ? (
                  <svg className="w-5 h-5 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#C62828]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className={`font-['Cinzel'] font-serif font-semibold text-xs tracking-wider mb-1 ${status === "correct" ? "text-[#2E7D32]" : "text-[#C62828]"}`}>
                  {status === "correct" ? "Respuesta correcta" : "Respuesta incorrecta"}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#5C4336]">
                  {status === "correct"
                    ? `Tu respuesta es correcta, has adquirido nuevos conocimientos.`
                    : `La respuesta correcta es «${correctAnswerText}». Revisa nuevamente para entender el concepto.`}
                </p>
                {!hasCollectedXP && !isPreviouslyAnswered && (
                  <button
                    onClick={handleCollectXP}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#E8C44A] text-[#2E2416] font-['Cinzel'] font-bold text-xs tracking-widest uppercase rounded shadow-[0_2px_8px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_12px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    Recoger +{formatXP(status === 'correct' ? xp : Math.max(5, Math.floor(xp / 2)))} XP
                  </button>
                )}
                {hasCollectedXP && !isPreviouslyAnswered && (
                  <div className="mt-3 text-[#D4AF37] font-['Cinzel'] font-bold text-[10px] sm:text-xs tracking-widest uppercase flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Experiencia extraída
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}