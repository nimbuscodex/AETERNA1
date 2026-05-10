const fs = require('fs');
const content = fs.readFileSync('src/content/guias/ciencias_naturales/fisica/fisica-3-4-fisica-atomica.md', 'utf8');

let processedContent = content;

processedContent = processedContent.replace(/<AeternaDecisionBox([\s\S]*?)(?<!<)\/>/g, (match, propsStr) => {
    // Parse question
    const qMatch = propsStr.match(/question=["']([^"']+)["']/);
    const question = qMatch ? qMatch[1] : '';
    
    // Parse options
    const options = [];
    const optRegex = /text:\s*["']([^"']+)["']/g;
    let optMatch;
    while ((optMatch = optRegex.exec(propsStr)) !== null) {
      options.push(optMatch[1]);
    }
    
    // Parse correctIndex
    const idxMatch = propsStr.match(/correctIndex=\{?(\d+)\}?/);
    const correctIndex = idxMatch ? parseInt(idxMatch[1]) : 0;
    
    let newContent = `Pregunta: ${question}\nOpciones:\n`;
    options.forEach(opt => {
      newContent += `- ${opt}\n`;
    });
    if (options[correctIndex]) {
      newContent += `RespuestaCorrecta: ${options[correctIndex]}\n`;
    }
    
    return `\n\`\`\`aeterna-question\n${newContent}\n\`\`\`\n`;
});

console.log(processedContent.includes('aeterna-question'));
console.log(processedContent.match(/aeterna-question/g)?.length);
