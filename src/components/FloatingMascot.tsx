import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageCircle, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const QUOTES = [
  "El conocimiento es poder. ¿Qué exploraremos hoy?",
  "La curiosidad es la brújula del alma.",
  "Cada lectura es un viaje a otra dimensión.",
  "Las constelaciones de ideas te esperan.",
  "La magia existe, se llama ciencia y filosofía."
];

export function FloatingMascot() {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Change quote randomly every time route changes
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
    
    // Auto show tooltip occasionally
    const timer = setTimeout(() => {
      if (!isHidden) setShowTooltip(true);
    }, 5000);
    
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname, isHidden]);

  if (isHidden) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 pointer-events-none print:hidden">
      {/* Tooltip */}
      <AnimatePresence>
        {(isHovered || showTooltip) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-14 relative bg-brand-ink text-brand-offwhite p-4 rounded-2xl rounded-br-none shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-brand-gold/30 max-w-[200px] pointer-events-auto"
          >
            <p className="text-xs font-serif italic text-brand-offwhite/90 leading-relaxed">
              "{QUOTES[quoteIndex]}"
            </p>
            <button 
              onClick={() => setIsHidden(true)} 
              className="absolute -top-2 -right-2 bg-brand-ink border border-brand-border rounded-full p-1 text-brand-muted hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-brand-ink transform rotate-45 border-r border-b border-brand-gold/30"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Circle */}
      <motion.div
        className="relative pointer-events-auto cursor-pointer group"
        onMouseEnter={() => { setIsHovered(true); setShowTooltip(true); }}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute -inset-1 blur-md bg-brand-gold/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -inset-2 blur-xl bg-brand-cosmic/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative w-16 h-16 rounded-full border-2 border-brand-gold/40 flex items-center justify-center overflow-hidden bg-brand-ink shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
          <img 
            src="/mascot.png" 
            alt="Mascota Aeterna" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
               // Fallback if user hasn't uploaded exact name
               e.currentTarget.src = "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=200&auto=format&fit=crop";
            }}
          />
        </div>
        
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-ink text-brand-gold border border-brand-gold/40 rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-3 h-3" />
        </div>
      </motion.div>
    </div>
  );
}
