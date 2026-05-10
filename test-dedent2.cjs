const fs = require('fs');
const content = fs.readFileSync('src/content/guias/ciencias_naturales/fisica/fisica-3-4-fisica-atomica.md', 'utf8');

const dedent = (text) => {
  const lines = text.split('\n');
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim().length > 0) {
      const indent = line.match(/^[ \t]*/)[0].length || 0;
      minIndent = Math.min(minIndent, indent);
    }
  }
  if (minIndent === Infinity || minIndent === 0) return text;
  return lines.map(line => line.length >= minIndent ? line.substring(minIndent) : line).join('\n');
};

let processedContent = content;

processedContent = processedContent.replace(/<NivelContenido([\s\S]*?)(?<!<)\/>/g, (match, inner) => {
  const levels = {};
  const backupRegex = /(principiante|intermedio|avanzado)=\{\s*<>\s*([\s\S]*?)\s*<\/>\s*\}/g;
  let m2;
  while ((m2 = backupRegex.exec(inner)) !== null) {
      levels[m2[1]] = dedent(m2[2]);
  }
  return `AAA${JSON.stringify((levels['intermedio'] || "").substring(0, 50))}BBB`;
});

console.log(processedContent.match(/AAA.*?BBB/g));
