import fs from 'fs';

let content = fs.readFileSync('src/components/ConstellationMap.tsx', 'utf-8');

// replace the useMemo for constellations
const mapStart = content.indexOf('  const constellations = useMemo(() => {');
const mapEnd = content.indexOf('  }, [articles, articleProgress]);') + '  }, [articles, articleProgress]);'.length;

const newMap = `  const constellations = useMemo(() => {
    return CATEGORIES_DATA.map(category => {
      const overrideIconName = iconOverrides[category.id];
      const Icon = overrideIconName && ALL_ICONS[overrideIconName] ? ALL_ICONS[overrideIconName] : category.icon;

      const subBranches = category.subcategories.map(sub => {
        // Collect articles for this subcategory
        const items = articles.filter(a => {
          const aCat = a.category?.toLowerCase() || '';
          const aSub = a.subcategory?.toLowerCase() || '';
          const aTags = (a.tags || []).map(t => t.toLowerCase());

          // Check if article belongs to this subcategory
          const matchesCategory = aCat === category.id.toLowerCase() || aCat === category.name.toLowerCase() || (aCat === 'guias' && aSub === category.id.toLowerCase());
          const matchesSub = aSub === sub.id.toLowerCase() || aSub === sub.name.toLowerCase() || aTags.includes(sub.id.toLowerCase()) || aTags.includes(sub.name.toLowerCase());
          
          if (matchesCategory && matchesSub) return true;
          // Loose matching if category directly matches subcategory
          if (aCat === sub.id.toLowerCase() || aCat === sub.name.toLowerCase()) return true;

          return false;
        });

        const completed = items.filter(a => (articleProgress[a.slug] || 0) === 100).length;

        return {
          id: sub.id,
          name: sub.name,
          articles: items,
          completedCount: completed,
          totalCount: items.length,
          parentId: category.id,
          icon: sub.icon
        };
      });

      const completedCount = subBranches.reduce((acc, sub) => acc + sub.completedCount, 0);
      const totalCount = subBranches.reduce((acc, sub) => acc + sub.totalCount, 0);

      return {
        id: category.id,
        name: category.name,
        icon: Icon,
        subBranches,
        completedCount,
        totalCount
      };
    });
  }, [articles, articleProgress, iconOverrides]);`;

content = content.slice(0, mapStart) + newMap + content.slice(mapEnd);

// Import CATEGORIES_DATA at the top
if (!content.includes('CATEGORIES_DATA')) {
  const importEnd = content.lastIndexOf('import ');
  const newlineAfterImport = content.indexOf('\n', importEnd);
  content = content.slice(0, newlineAfterImport) + '\nimport { CATEGORIES_DATA } from "@/data/categories";' + content.slice(newlineAfterImport);
}

// Modify SubIcon logic
const subIconLogicStart = content.indexOf(`const defaultSubIconName = CATEGORY_ICONS[sub.id] || 'Star';`);
const subIconLogicEnd = content.indexOf(`return (`, subIconLogicStart);

const newSubIconLogic = `const overrideSubIconName = iconOverrides[\`sub-\${node.id}-\${sub.id}\`];
                        let SubIcon = overrideSubIconName && ALL_ICONS[overrideSubIconName] ? ALL_ICONS[overrideSubIconName] : sub.icon || Star;
                        
                        if (!overrideSubIconName) {
                          if (sub.name.includes('Japonés')) {
                            SubIcon = ({ className }: any) => <span className={\`text-[12px] md:text-[14px] font-bold leading-none \${className || ''}\`}>あ</span>;
                          } else if (sub.name.includes('Inglés')) {
                            SubIcon = ({ className }: any) => <span className={\`text-[12px] md:text-[14px] font-bold leading-none \${className || ''}\`}>EN</span>;
                          }
                        }
                        `;

content = content.slice(0, subIconLogicStart) + newSubIconLogic + content.slice(subIconLogicEnd);

// Modify modal SubIcon logic
const modalSubIconLogicStart = content.indexOf(`const defaultModalSubIcon = CATEGORY_ICONS[selectedSubBranch.id] || 'Star';`);
const modalSubIconLogicEnd = content.indexOf(`return (`, modalSubIconLogicStart);

const newModalSubIconLogic = `const overrideModalSubIcon = iconOverrides[\`sub-\${selectedSubBranch.parentId}-\${selectedSubBranch.id}\`];
                    let ModalSubIcon = overrideModalSubIcon && ALL_ICONS[overrideModalSubIcon] ? ALL_ICONS[overrideModalSubIcon] : selectedSubBranch.icon || Star;
                    
                    if (!overrideModalSubIcon) {
                      if (selectedSubBranch.name.includes('Japonés')) {
                        ModalSubIcon = ({ className }: any) => <span className={\`text-[20px] font-bold leading-none \${className || ''}\`}>あ</span>;
                      } else if (selectedSubBranch.name.includes('Inglés')) {
                        ModalSubIcon = ({ className }: any) => <span className={\`text-[20px] font-bold leading-none \${className || ''}\`}>EN</span>;
                      }
                    }
                    `;

content = content.slice(0, modalSubIconLogicStart) + newModalSubIconLogic + content.slice(modalSubIconLogicEnd);

fs.writeFileSync('src/components/ConstellationMap.tsx', content, 'utf-8');
