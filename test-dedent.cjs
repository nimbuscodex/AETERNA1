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

const text = `
      ### La estructura del núcleo: protones, neutrones y la interacción fuerte
      
      El núcleo atómico concentra el 99.97% de la masa del átomo en un volumen billones de veces menor.
`;
console.log(JSON.stringify(dedent(text)));
