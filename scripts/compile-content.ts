import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseFrontmatter(markdown: string) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = markdown.match(frontmatterRegex);
  if (!match) return { data: {}, content: markdown };

  const data: any = {};
  const dataString = match[1];
  dataString.split("\n").forEach(line => {
    const splitIndex = line.indexOf(":");
    if (splitIndex !== -1) {
      const key = line.slice(0, splitIndex).trim();
      let value = line.slice(splitIndex + 1).trim();
      value = value.replace(/^["']|["']$/g, '');
      if (value.startsWith("[") && value.endsWith("]")) {
        data[key] = value.slice(1, -1).split(",").map(v => v.trim().replace(/^["']|["']$/g, ''));
      } else {
        data[key] = value;
      }
    }
  });

  return { data, content: markdown.replace(frontmatterRegex, "").trim() };
}

function extractComponent(content: string, tagName: string) {
  const matches: any[] = [];
  const startTag = `<${tagName}`;
  let pos = content.indexOf(startTag);
  
  while (pos !== -1) {
    let endPos = -1;
    let searchPos = pos + startTag.length;
    
    // HEURISTIC: Find /> that is not part of </>, or find </tagName>
    const nextCloseTag = content.indexOf(`</${tagName}>`, searchPos);
    
    // Search for self-closing /> that is NOT part of </>
    let nextSelfClose = -1;
    let tempPos = searchPos;
    while (true) {
      const found = content.indexOf('/>', tempPos);
      if (found === -1) break;
      if (content[found - 1] !== '<') {
        nextSelfClose = found;
        break;
      }
      tempPos = found + 2;
    }

    if (nextCloseTag !== -1 && (nextSelfClose === -1 || nextCloseTag < nextSelfClose)) {
      endPos = nextCloseTag + `</${tagName}>`.length;
      const full = content.slice(pos, endPos);
      const props = content.slice(pos + startTag.length, content.indexOf('>', pos));
      const children = full.slice(content.indexOf('>', pos) + 1, nextCloseTag);
      matches.push({ full, props, children });
    } else if (nextSelfClose !== -1) {
      endPos = nextSelfClose + 2;
      const full = content.slice(pos, endPos);
      const props = full.slice(startTag.length, -2);
      matches.push({ full, props, children: '' });
    }
    
    if (endPos === -1) break; // Avoid infinite loop if not found
    pos = content.indexOf(startTag, endPos);
  }
  return matches;
}

function parseProps(propsStr: string) {
  const props: any = {};
  const levels = ['principiante', 'intermedio', 'avanzado'];
  
  levels.forEach(level => {
    const regex = new RegExp(`${level}\\s*=\\s*\\{\\s*<>`, 'i');
    const match = propsStr.match(regex);
    
    if (match) {
      const contentStart = match.index! + match[0].length;
      const contentEnd = propsStr.indexOf('</>}', contentStart);
      if (contentEnd !== -1) {
        props[level] = propsStr.slice(contentStart, contentEnd).trim();
      }
    }
  });
  return props;
}

function compileArticle(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = parseFrontmatter(raw);
  const filename = path.basename(filePath, path.extname(filePath));

  const article: any = {
    metadata: {
      ...data,
      slug: data.slug || filename
    },
    introduccion: '',
    secciones: [],
    conclusion: ''
  };

  const sectionsRaw = content.split(/\n(?=## )/);
  
  if (sectionsRaw[0] && !sectionsRaw[0].startsWith('## ')) {
    article.introduccion = sectionsRaw.shift()?.trim() || '';
  }

  let currentLevelForSections = 'intermedio';

  sectionsRaw.forEach((sectionStr, index) => {
    const titleMatch = sectionStr.match(/^## (.*)/);
    const title = titleMatch ? titleMatch[1].trim() : `Sección ${index + 1}`;
    const sectionId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    const titleLower = title.toLowerCase();
    if (titleLower.includes('capa i') || titleLower.includes('capa 1')) {
      currentLevelForSections = 'principiante';
    } else if (titleLower.includes('capa ii') || titleLower.includes('capa 2')) {
      currentLevelForSections = 'intermedio';
    } else if (titleLower.includes('capa iii') || titleLower.includes('capa 3')) {
      currentLevelForSections = 'avanzado';
    }

    let sectionContent = sectionStr.replace(/^## .*\n?/, '').trim();
    
    const nivelMatches = extractComponent(sectionContent, 'NivelContenido');
    const niveles: any = {};
    
    if (nivelMatches.length > 0) {
      const props = parseProps(nivelMatches[0].props);
      niveles.principiante = props.principiante || '';
      niveles.intermedio = props.intermedio || '';
      niveles.avanzado = props.avanzado || '';
      
      sectionContent = sectionContent.replace(nivelMatches[0].full, '').trim();
    } else {
      if (titleLower.includes('capa i') || titleLower.includes('capa 1') || titleLower.includes('principiante')) {
        niveles.principiante = sectionContent;
      } else if (titleLower.includes('capa ii') || titleLower.includes('capa 2') || titleLower.includes('intermedio')) {
        niveles.intermedio = sectionContent;
      } else if (titleLower.includes('capa iii') || titleLower.includes('capa 3') || titleLower.includes('avanzado')) {
        niveles.avanzado = sectionContent;
      } else {
        if (titleLower.includes('bienvenida') || titleLower.includes('introducción') || titleLower.includes('faq') || titleLower.includes('preguntas')) {
            niveles.principiante = sectionContent;
            niveles.intermedio = sectionContent;
            niveles.avanzado = sectionContent;
        } else {
            niveles[currentLevelForSections] = sectionContent;
        }
      }
    }

    const accionMatches = extractComponent(sectionContent, 'AccionBotones');
    const acciones: any[] = [];
    if (accionMatches.length > 0) {
      const inner = accionMatches[0].children || '';
      ['BotonSimplificar', 'BotonProfundizar', 'BotonEjemplos', 'BotonConexiones'].forEach(btnType => {
        const btnMatches = extractComponent(inner, btnType);
        btnMatches.forEach(bm => {
          acciones.push({
            tipo: btnType,
            contenido: (bm.children || bm.props || '').trim()
          });
        });
      });
    }

    article.secciones.push({
      id: sectionId,
      titulo: title,
      niveles,
      acciones
    });
  });

  return article;
}

const contentDir = path.resolve(__dirname, '../src/content');
const outputDir = path.resolve(__dirname, '../src/data/articles');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function walk(dir: string, callback: (f: string) => void) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach( f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

console.log('🚀 Compilando artículos a JSON (con soporte robusto)...');

walk(contentDir, (filePath) => {
  if (filePath.endsWith('.md')) {
    try {
      const article = compileArticle(filePath);
      const outputPath = path.join(outputDir, `${article.metadata.slug}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
      console.log(`✅ Compilado: ${article.metadata.slug}`);
    } catch (e) {
      console.error(`❌ Error en ${filePath}:`, e);
    }
  }
});

console.log('✨ Proceso completado.');
