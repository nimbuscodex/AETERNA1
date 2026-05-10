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

const regex = /(principiante|intermedio|avanzado)=\{\s*<>\n?([\s\S]*?)\n?\s*<\/>\s*\}/g;
let m;
let res = [];
content.replace(/<NivelContenido([\s\S]*?)(?<!<)\/>/g, (match, inner) => {
    while ((m = regex.exec(inner)) !== null) {
      if(m[1] === 'intermedio') res.push(dedent(m[2]));
    }
});

console.log(JSON.stringify(res[1]));
