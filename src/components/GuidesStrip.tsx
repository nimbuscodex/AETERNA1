import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Globe, Camera, BookOpen, Library, History, Atom, Palette, Brain, Music, Landmark } from "lucide-react";

const GUIDES = [
  { name: "Filosofía", path: "/guias/humanidades/filosofia", icon: BookOpen },
  { name: "Idiomas", path: "/guias/idiomas", icon: Globe },
  { name: "Ciencias", path: "/guias/ciencias_naturales", icon: Atom },
  { name: "Literatura", path: "/guias/humanidades/literatura", icon: Library },
  { name: "Historia", path: "/guias/humanidades/historia", icon: History },
  { name: "Artes", path: "/guias/artes", icon: Palette },
  { name: "Psicología", path: "/guias/ciencias_sociales/psicologia", icon: Brain },
  { name: "Música", path: "/guias/artes/musica", icon: Music },
  { name: "Geología", path: "/guias/ciencias_naturales/geologia", icon: Landmark },
  { name: "Fotografía", path: "/guias/artes/fotografia", icon: Camera },
];

export function GuidesStrip() {
  return (
    <div className="w-full bg-brand-ink py-4 overflow-hidden group no-print">
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex items-center justify-between gap-12 overflow-x-auto no-scrollbar">
          {GUIDES.map((guide, i) => (
            <motion.div
              key={guide.name}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Link
                to={guide.path}
                className="flex items-center gap-4 group/item whitespace-nowrap"
              >
                <guide.icon className="h-3 w-3 text-brand-gold group-hover/item:text-brand-offwhite transition-colors" />
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-brand-offwhite/40 group-hover/item:text-brand-offwhite transition-all duration-300">
                  {guide.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
