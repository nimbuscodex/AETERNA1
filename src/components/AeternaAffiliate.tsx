import React from 'react';
import { motion } from 'motion/react';

interface AeternaAffiliateProps {
  content: string;
}

export function AeternaAffiliate({ content }: AeternaAffiliateProps) {
  const lines = content.split('\n');
  const metadata: Record<string, string> = {
    TITLE: '',
    AUTHOR: '',
    IMAGE: '',
    LINK: '',
    RATING: '',
    DESCRIPTION: '',
  };

  let currentKey = '';
  let descriptionLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^([A-Z]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1];
      metadata[currentKey] = match[2].trim();
      if (currentKey === 'DESCRIPTION') {
        descriptionLines.push(metadata[currentKey]);
      }
    } else if (currentKey === 'DESCRIPTION') {
      descriptionLines.push(line.trim());
    }
  }

  const title = metadata['TITLE'] || 'Libro recomendado';
  const author = metadata['AUTHOR'] || '';
  const image = metadata['IMAGE'] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop';
  const link = metadata['LINK'] || '#';
  const ratingStr = metadata['RATING'] || '5.0';
  const ratingNum = parseFloat(ratingStr) || 5;
  const description = descriptionLines.join(' ');

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap');
        .aeterna-unique-title {
          font-family: 'Abril Fatface', serif;
          letter-spacing: 0.02em;
        }
      `}} />
      <motion.aside
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="my-20 mx-auto max-w-2xl relative"
      >
      {/* Tarjeta principal con estética de ficha de archivo */}
      <div className="relative bg-gradient-to-br from-[#fbd786] via-[#faa014] to-[#f7797d] border-2 border-dashed border-white/60 rounded-lg p-6 sm:p-8 shadow-[6px_6px_0px_rgba(250,160,20,0.3),12px_12px_30px_-15px_rgba(250,160,20,0.4)] hover:shadow-[8px_8px_0px_rgba(250,160,20,0.3),16px_16px_40px_-15px_rgba(250,160,20,0.5)] transition-shadow duration-500">
        
        {/* Clip metálico decorativo (esquina superior izquierda) */}
        <div className="absolute -top-3 -left-3 z-20">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]">
            <rect 
              x="8" y="8" width="32" height="16" rx="3" 
              fill="url(#clip-gradient)" 
              stroke="#9CA3AF" strokeWidth="1.5"
            />
            <path d="M10 14h28" stroke="#9CA3AF" strokeWidth="1.5" />
            <path d="M10 10v30" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            <path d="M38 10v30" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="clip-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="100%" stopColor="#9CA3AF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Sello de lacre (esquina superior derecha) */}
        <div className="absolute -top-4 -right-4 z-20">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8B3A3A] to-[#5C1E1E] shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.1)] flex items-center justify-center">
            <span className="font-serif text-2xl text-[#FDF8F0] font-bold select-none">æ</span>
          </div>
        </div>

        {/* Insignia de recompensa gamificada */}
        <div className="absolute -bottom-3 right-6 z-20">
          <div className="flex items-center gap-1.5 bg-[#2E2416] text-[#C9A96E] px-3 py-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[0.6rem] font-bold font-sans tracking-[0.15em] uppercase">+5 Sabiduría</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mt-2">
          {/* Columna de la portada */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-36 sm:w-44 transition-all duration-500 hover:-translate-y-1 hover:rotate-[-1deg] group"
            >
              {/* Sombra de la foto */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-4 bg-black/20 blur-lg rounded-[100%] transition-all duration-500 group-hover:w-[90%] group-hover:h-5 group-hover:bg-black/30" />
              
              <img
                src={image}
                alt={title}
                className="relative w-full h-auto rounded-sm shadow-[0_2px_1px_#fff_inset,0_-2px_1px_rgba(0,0,0,0.15)_inset,0_6px_15px_rgba(0,0,0,0.2)]"
                referrerPolicy="no-referrer"
              />

              {/* Efecto de cinta adhesiva en la esquina superior */}
              <div className="absolute -top-2 -left-2 w-12 h-4 bg-[#FDF8F0]/80 backdrop-blur-sm rotate-[-35deg] shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
            </a>
          </div>

          {/* Columna de información */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Etiqueta tipo máquina de escribir */}
            <div className="font-mono text-[0.55rem] text-[#A68B6E] tracking-[0.15em] uppercase mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A96E]" />
              Archivo #{Math.floor(Math.random() * 9000) + 1000}
            </div>

            <h3 
              className="aeterna-unique-title text-balance"
              style={{
                color: '#000000',
                fontSize: 'clamp(1.5rem, 3.5vw + 0.5rem, 2.25rem)',
                lineHeight: '1.2',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid rgba(0,0,0,0.15)',
                textShadow: '0 2px 10px rgba(0,0,0,0.05)',
                marginTop: '0',
                overflowWrap: 'break-word'
              }}
            >
              {title}
            </h3>

            {author && (
              <p className="font-sans text-xs text-[#8B6F5A] italic mb-4">
                {author}
              </p>
            )}

            {/* Descripción con fuente mecanografiada simulada */}
            <p className="font-mono text-[0.7rem] sm:text-xs text-[#5C4336]/80 leading-relaxed mb-5 bg-[#F5EEDB]/50 p-3 rounded-sm border border-[#E8D9CC]/50">
              {description}
            </p>

            {/* Valoración con estrellas y botón */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < ratingNum ? 'text-[#C9A96E]' : 'text-[#D6C5B3]'}`}
                    fill={i < ratingNum ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ))}
                <span className="font-mono text-[0.65rem] text-[#8B6F5A] ml-1">{ratingStr}</span>
              </div>

              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3E2C23] text-[#FDF8F0] font-sans text-[0.65rem] font-bold tracking-[0.15em] uppercase rounded-sm hover:bg-[#8B5A3C] transition-all duration-300 shadow-[4px_4px_0px_#C9A96E] hover:shadow-[6px_6px_0px_#B8860B] hover:-translate-x-[1px] hover:-translate-y-[1px]"
              >
                Adquirir
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Borde perforado inferior (simulando un ticket) */}
        <div className="mt-6 pt-3 border-t-2 border-dashed border-[#D6C5B3]/60 flex justify-center">
          <div className="flex gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#E8D9CC]" />
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
    </>
  );
}