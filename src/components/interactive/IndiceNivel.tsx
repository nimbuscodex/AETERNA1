import React from 'react';
import { List } from 'lucide-react';

export interface IndiceNivelProps {
  titulo: string;
  children: React.ReactNode;
}

export function IndiceNivel({ titulo, children }: IndiceNivelProps) {
  return (
    <div className="bg-brand-gray/10 rounded-xl p-6 my-8 border border-brand-charcoal/10">
      <div className="flex items-center gap-3 mb-4 text-brand-ink">
        <List className="w-5 h-5 text-brand-gold" />
        <h3 className="text-xl font-bold font-serif m-0">{titulo}</h3>
      </div>
      <div className="text-brand-charcoal space-y-2 text-sm md:text-base prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline">
        {children}
      </div>
    </div>
  );
}
