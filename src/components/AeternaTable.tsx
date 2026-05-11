import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface AeternaTableProps {
  children: React.ReactNode;
}

export default function AeternaTable({ children }: AeternaTableProps) {
  return (
    <div className="not-prose my-32 mx-auto max-w-5xl group">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-[3rem] border border-[#d4af37]/30 bg-white shadow-2xl transition-all duration-700 group-hover:border-[#8B6914]/50"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-serif">
            {children}
          </table>
        </div>
        
        {/* Verification Footer */}
        <div className="bg-[#1A1A1A] py-6 px-12 flex justify-between items-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-[#8B6914]/10 to-transparent pointer-events-none" />
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[11px] font-mono font-black text-[#D4AF37] uppercase tracking-[0.5em]">Matriz de Datos Axiomática Verificada</span>
           </div>
           <div className="flex gap-4 relative z-10 opacity-40">
              <div className="w-1.5 h-1.5 rotate-45 border border-[#D4AF37]" />
              <div className="w-1.5 h-1.5 rotate-45 border border-[#D4AF37]" />
              <div className="w-1.5 h-1.5 rotate-45 border border-[#D4AF37]" />
           </div>
        </div>
      </motion.div>
    </div>
  );
}

export const TableHead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-[#FDFBF7] border-b-2 border-[#d4af37]/10">
    {children}
  </thead>
);

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-black/[0.03] last:border-0 hover:bg-[#FDFBF7] transition-colors duration-300 group/row">
    {children}
  </tr>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th className="px-12 py-10 text-[12px] font-mono font-black uppercase tracking-[0.4em] text-[#8B6914] relative">
    {children}
    <div className="absolute bottom-0 left-12 right-12 h-px bg-[#8B6914]/10" />
  </th>
);

export const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-12 py-10 text-[18px] md:text-[20px] text-[#3E2C23] font-serif font-light leading-relaxed italic opacity-80 group-hover/row:opacity-100 transition-opacity">
    {children}
  </td>
);
