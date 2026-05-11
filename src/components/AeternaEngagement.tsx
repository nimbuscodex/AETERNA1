import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, AlertTriangle, Gamepad2, TrendingUp, Zap, Lightbulb, ShieldAlert, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EngagementBlockProps {
  type: 'did-you-know' | 'common-error' | 'mini-challenge' | 'progress' | 'key-concept';
  title: string;
  content: string;
  extra?: string;
}

export function AeternaEngagement({ type, title, content, extra }: EngagementBlockProps) {
  const configs = {
    'did-you-know': {
      icon: Sparkles,
      color: 'text-[#8B6914]',
      bg: 'bg-[#fefcf5]',
      border: 'border-[#d4af37]/40',
      label: 'FRAGMENTO DE ARCHIVO',
      accent: 'bg-[#d4af37]/10'
    },
    'common-error': {
      icon: ShieldAlert,
      color: 'text-rose-700',
      bg: 'bg-rose-50/30',
      border: 'border-rose-200/60',
      label: 'DISONANCIA COGNITIVA',
      accent: 'bg-rose-500/10'
    },
    'mini-challenge': {
      icon: Gamepad2,
      color: 'text-blue-700',
      bg: 'bg-blue-50/30',
      border: 'border-blue-200/60',
      label: 'PRUEBA DE VÍNCULO',
      accent: 'bg-blue-500/10'
    },
    'progress': {
      icon: TrendingUp,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50/30',
      border: 'border-emerald-200/60',
      label: 'NIVEL DE ASIMILACIÓN',
      accent: 'bg-emerald-500/10'
    },
    'key-concept': {
      icon: Lightbulb,
      color: 'text-amber-700',
      bg: 'bg-amber-50/30',
      border: 'border-amber-200/60',
      label: 'AXIOMA FUNDAMENTAL',
      accent: 'bg-amber-500/10'
    }
  };

  const config = configs[type] || configs['did-you-know'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "my-24 rounded-[2.5rem] border overflow-hidden transition-all duration-700 hover:shadow-2xl group relative",
        config.border,
        config.bg
      )}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
      
      <div className="p-10 md:p-16 relative z-10 overflow-hidden">
        {/* Massive watermark icon */}
        <div className="absolute -right-20 -bottom-20 opacity-[0.02] pointer-events-none group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000">
           <Icon size={400} />
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
          {/* Main Icon Artifact */}
          <div className={cn(
            "shrink-0 w-24 h-24 rounded-[2rem] flex items-center justify-center border shadow-lg transition-all duration-700 bg-white group-hover:-translate-y-2",
            config.border
          )}>
            <div className={cn("w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-colors duration-700", config.accent)}>
              <Icon className={cn("w-10 h-10", config.color)} />
            </div>
          </div>
          
          <div className="flex-1">
            {/* Header label with line decoration */}
            <div className="flex items-center gap-6 mb-8">
               <span className={cn("text-[10px] font-mono font-black uppercase tracking-[0.6em]", config.color)}>{config.label}</span>
               <div className={cn("h-px flex-1 opacity-20", config.color.replace('text', 'bg'))} />
            </div>
            
            {/* Title with specialized font */}
            <h4 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] mb-8 leading-tight tracking-tighter uppercase">{title}</h4>
            
            {/* Body content with improved typography */}
            <div className="text-[#3E2C23] leading-relaxed italic text-xl md:text-2xl font-serif opacity-80 border-l-2 border-black/5 pl-8">
              {content}
            </div>
            
            {/* Footer with meta information */}
            {extra && (
              <div className="mt-12 pt-10 border-t border-black/5 flex items-center gap-6">
                 <div className={cn("w-3 h-3 rounded-full animate-pulse shadow-sm", config.color.replace('text', 'bg'))} />
                 <span className="text-[11px] font-mono font-black uppercase tracking-[0.4em] text-black/30 group-hover:text-black/60 transition-colors">{extra}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative corner binding */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-40", config.color.replace('text', 'bg'))} />
    </motion.div>
  );
}

export function AeternaEngagementSuite({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-12 my-32 px-4">
      {children}
    </div>
  );
}
