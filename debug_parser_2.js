
function parseProps(propsStr) {
  const props = {};
  const levels = ['principiante', 'intermedio', 'avanzado'];
  console.log('--- parseProps ---');
  console.log('propsStr:', JSON.stringify(propsStr));
  
  levels.forEach(level => {
    const regex = new RegExp(`${level}\\s*=\\s*\\{\\s*<>`, 'i');
    const match = propsStr.match(regex);
    console.log(`Checking level: ${level}, match found:`, !!match);
    
    if (match) {
      const contentStart = match.index + match[0].length;
      console.log(`  contentStart: ${contentStart}`);
      // Find the matching </>}
      const contentEnd = propsStr.indexOf('</>}', contentStart);
      console.log(`  contentEnd: ${contentEnd}`);
      if (contentEnd !== -1) {
        props[level] = propsStr.slice(contentStart, contentEnd).trim();
      }
    }
  });
  return props;
}

const propsStr = `\n  principiante={<>\n    ### El universo en un grano de arena\n    ... \n  </>}\n  intermedio={<>\n    ### Evolución de los Modelos Atómicos\n    ... \n  </>}\n`;
const props = parseProps(propsStr);
console.log('Final props:', JSON.stringify(props, null, 2));
