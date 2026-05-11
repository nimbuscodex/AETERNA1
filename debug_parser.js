
function extractComponent(content, tagName) {
  const matches = [];
  if (tagName === 'NivelContenido' || tagName === 'BotonTransicion' || tagName === 'ProgresionArticulo') {
    const startTag = `<${tagName}`;
    let pos = content.indexOf(startTag);
    while (pos !== -1) {
      const rest = content.slice(pos);
      const closeMatch = rest.match(/[\s\S]*?(?<!<\/)\/>/);
      if (closeMatch) {
        const endPos = pos + closeMatch[0].length;
        const full = content.slice(pos, endPos);
        const props = full.slice(startTag.length, -2);
        matches.push({ full, props, children: '' });
      }
      pos = content.indexOf(startTag, pos + 1);
    }
  }
  return matches;
}

function parseProps(propsStr) {
  const props = {};
  const levels = ['principiante', 'intermedio', 'avanzado'];
  levels.forEach(level => {
    const regex = new RegExp(`${level}\\s*=\\s*\\{\\s*<>`);
    const match = propsStr.match(regex);
    if (match) {
      const contentStart = match.index + match[0].length;
      const contentEnd = propsStr.indexOf('</>}', contentStart);
      if (contentEnd !== -1) {
        props[level] = propsStr.slice(contentStart, contentEnd).trim();
      }
    }
  });
  return props;
}

const testContent = `
## 1. El Concepto del Átomo
<NivelContenido
  principiante={<>
    ### El universo en un grano de arena
    Imagina que cortas un trozo de hierro por la mitad una y otra vez. ¿Hasta dónde puedes llegar? Demócrito, hace 2.500 años, llamó a la pieza final *átomo* ("sin corte"). 
  </>}
  intermedio={<>
    ### Evolución de los Modelos Atómicos
    Nuestra comprensión ha pasado por fases críticas:
  </>}
  avanzado={<>
    ### El Tratamiento Cuántico Completo
    Abandonamos las órbitas por **orbitales**: nubes de probabilidad definidas por la ecuación de Schrödinger:
    $$\\hat{H}\\Psi = E\\Psi$$
  </>}
/>
`;

const matches = extractComponent(testContent, 'NivelContenido');
console.log('Matches found:', matches.length);
if (matches.length > 0) {
  console.log('Props string length:', matches[0].props.length);
  const props = parseProps(matches[0].props);
  console.log('Parsed props:', JSON.stringify(props, null, 2));
}
