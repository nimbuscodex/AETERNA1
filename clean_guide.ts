import fs from 'fs';

let content = fs.readFileSync('src/pages/GuidePage.tsx', 'utf-8');

// Replace everything before export function GuidePage
const newTop = `import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Lock, PlayCircle, BookOpen, Brain, Star, Filter, ChevronDown, Gamepad2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGamification } from "../context/GamificationContext";
import { KanaTool } from "@/components/interactive/KanaTool";
import { KanaGameV2 } from "@/components/interactive/KanaGameV2";
import { CATEGORIES_DATA } from "@/data/categories";
import { ROADMAPS, Step } from "@/data/roadmaps";
`;

const exportIndex = content.indexOf('export function GuidePage() {');
let newContent = newTop + '\n' + content.slice(exportIndex);

// Now inside the function, replace the old mappings with dynamic ones
const oldMapStart = newContent.indexOf('const FANS_MAP');
const oldMapEnd = newContent.indexOf('const hasFan =', oldMapStart);

const dynamicMap = `
  const normalizedCategory = category.replace(/-/g, "_");
  
  const FANS_MAP: Record<string, any[]> = {
    guias: CATEGORIES_DATA.map(c => ({ id: c.id, name: c.name, icon: "📚", subcategory: "General", pathPrefix: "/guias/" }))
  };

  CATEGORIES_DATA.forEach(cat => {
    FANS_MAP[cat.id] = cat.subcategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      icon: "📚", 
      subcategory: cat.name
    }));
  });

  const hasFan = !!FANS_MAP[normalizedCategory];
  const activeKey = hasFan ? (selectedSub || normalizedCategory) : normalizedCategory;
  const roadmap = ROADMAPS[activeKey] || ROADMAPS.guias;

  const showsSelection = hasFan && !selectedSub;
  let selectionItems = FANS_MAP[normalizedCategory] || [];
`;

newContent = newContent.slice(0, oldMapStart) + dynamicMap + newContent.slice(newContent.indexOf('const availableSubcategories', oldMapEnd));

// Also fix the title rendering since we removed the hardcoded string checks
const titleStart = newContent.indexOf('{showsSelection ? (');
const titleEnd = newContent.indexOf(') : roadmap.title}');

const dynamicTitle = `{showsSelection ? (
                    normalizedCategory === "guias" ? "Catálogo Maestro" : \`Explora \${CATEGORIES_DATA.find(c => c.id === normalizedCategory)?.name || category}\`
                  ) : roadmap.title}`;

newContent = newContent.slice(0, titleStart) + dynamicTitle + newContent.slice(titleEnd + ') : roadmap.title}'.length);

fs.writeFileSync('src/pages/GuidePage.tsx', newContent, 'utf-8');
console.log("GuidePage rewritten successfully.");
