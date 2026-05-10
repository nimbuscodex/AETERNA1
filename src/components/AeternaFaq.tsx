import React, { useState, useEffect } from 'react';

interface FaqItemData {
  question: React.ReactNode;
  answer: React.ReactNode;
  defaultOpen?: boolean;
  isCollapsible?: boolean;
}

interface AeternaFaqProps {
  title?: React.ReactNode;
  items: FaqItemData[];
}

export default function AeternaFaq({ title = "❓ Preguntas frecuentes", items }: AeternaFaqProps) {
  return (
    <div className="not-prose relative w-full max-w-3xl mx-auto mt-12 mb-4 group/faq">
      {/* Marco decorativo principal */}
      <div className="absolute inset-0 bg-[#fefcf5] border border-[#d4af37]/40 rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15),inset_0_0_0_4px_rgba(255,255,255,0.8)] transform -z-10"></div>
      
      {/* Esquinas ornamentales */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]/60 rounded-tl-2xl -translate-x-1 -translate-y-1 pointer-events-none transition-all duration-500 group-hover/faq:-translate-x-2 group-hover/faq:-translate-y-2"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]/60 rounded-tr-2xl translate-x-1 -translate-y-1 pointer-events-none transition-all duration-500 group-hover/faq:translate-x-2 group-hover/faq:-translate-y-2"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]/60 rounded-bl-2xl -translate-x-1 translate-y-1 pointer-events-none transition-all duration-500 group-hover/faq:-translate-x-2 group-hover/faq:translate-y-2"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]/60 rounded-br-2xl translate-x-1 translate-y-1 pointer-events-none transition-all duration-500 group-hover/faq:translate-x-2 group-hover/faq:translate-y-2"></div>

      <div className="px-6 py-6 sm:px-12 sm:py-8">
        <div className="flex flex-col items-center mb-4">
          {/* Símbolo central arriba del título */}
          <div className="text-[#8B6914] text-opacity-80">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="font-['Cinzel'] text-xl sm:text-2xl text-[#2E2416] text-center tracking-widest font-serif font-bold relative z-10 flex flex-col items-center gap-1 mt-1 [&_p]:m-0 [&_p]:p-0">
            {title}
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent mt-3"></div>
        </div>
        
        <div className="space-y-2">
          {items.map((item, idx) => (
            <FaqItem 
              key={idx} 
              question={item.question} 
              answer={item.answer} 
              defaultOpen={idx === 0 ? true : (item.defaultOpen || false)} 
              isCollapsible={idx === 0 ? false : true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer, defaultOpen, isCollapsible = true }: FaqItemData) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!isCollapsible) {
      setIsOpen(true);
    }
  }, [isCollapsible]);

  return (
    <div className={`faq-item relative group py-2`}>
      {/* Separador superior sutil para items colapsables */}
      {isCollapsible && <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent"></div>}
      
      {/* Línea lateral decorativa en hover o activa */}
      <div className={`absolute left-0 top-3 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[#B8860B] via-[#D4AF37] to-transparent transition-all duration-300 ${isOpen ? 'opacity-100 h-[calc(100%-24px)]' : 'opacity-0 h-0 group-hover:opacity-40 group-hover:h-8'}`}></div>

      <div
        onClick={() => isCollapsible && setIsOpen(!isOpen)}
        className={`w-full flex items-start justify-between pl-6 pr-2 py-3 bg-transparent text-left font-['Cinzel'] font-semibold text-lg sm:text-[19px] text-[#3E2C23] tracking-wide font-serif ${isCollapsible ? 'cursor-pointer hover:text-[#8B6914] transition-colors' : 'cursor-default'}`}
        aria-expanded={isOpen}
      >
        <span className="pr-6 leading-tight flex-1 tracking-wider">{question}</span>
        {isCollapsible && (
          <div className="mt-0.5 flex-shrink-0 relative w-7 h-7 flex items-center justify-center rounded-full border border-[#d4af37]/30 bg-white group-hover:border-[#d4af37] transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
            <svg
              className={`w-3.5 h-3.5 text-[#8B6914] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
      
      <div 
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pl-6 pr-4 pb-4 pt-1 font-['Inter'] text-[15px] sm:text-base leading-relaxed text-[#5C4336]">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}
