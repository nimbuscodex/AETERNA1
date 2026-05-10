const fs = require('fs');
const content = fs.readFileSync('src/content/guias/ciencias_naturales/fisica/fisica-3-4-fisica-atomica.md', 'utf8');

const decisionReplaced = content.match(/<AeternaDecisionBox([\s\S]*?)(?<!<)\/>/g);
console.log(decisionReplaced ? decisionReplaced.length : 0);
if(decisionReplaced) console.log(decisionReplaced[0]);
