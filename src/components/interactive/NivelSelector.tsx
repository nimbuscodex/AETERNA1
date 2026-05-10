import React, { useEffect } from 'react';
import { useLevel } from '@/context/LevelContext';

export interface NivelSelectorProps {
  niveles?: string[];
  nivelPorDefecto?: string;
}

export function NivelSelector({ 
  niveles = ['Principiante', 'Intermedio', 'Avanzado'], 
  nivelPorDefecto = 'Intermedio' 
}: NivelSelectorProps) {
  const { activeLevel, setActiveLevel } = useLevel();

  // Initialize with default level if changing page or on mount
  useEffect(() => {
    if (nivelPorDefecto && niveles.includes(nivelPorDefecto)) {
      setActiveLevel(nivelPorDefecto);
    }
  }, [nivelPorDefecto, niveles, setActiveLevel]);

  return (
    <div className="flex bg-[#FDF8F0] border border-[#D6C5B3]/60 rounded-full p-1.5 my-10 max-w-lg mx-auto shadow-sm relative z-10">
      {niveles.map(nivel => {
        const isActive = activeLevel.toLowerCase() === nivel.toLowerCase();
        return (
          <button
            key={nivel}
            onClick={() => setActiveLevel(nivel)}
            className={`flex-1 px-4 py-2.5 text-xs sm:text-sm font-sans font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${
              isActive 
                ? 'bg-[#8B5A3C] text-white shadow-md transform scale-[1.02]' 
                : 'text-[#8B6F5A]/70 hover:text-[#5C4336] hover:bg-[#E8D9CC]/30'
            }`}
          >
            {nivel}
          </button>
        );
      })}
    </div>
  );
}
