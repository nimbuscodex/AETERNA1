import React from 'react';
import { Sparkles, Circle, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Props {
  content: string;
}

export function AeternaPracticeProblem({ content }: Props) {
  // Parsing the content
  const titleMatch = content.match(/(?:TITLE|LABEL):\s*(.*)/) || content.match(/###\s*(.*)/);
  const rawTitle = titleMatch ? titleMatch[1].trim() : 'Problema';

  let problemLabel = 'Problema Resuelto';
  let mainTitle = rawTitle;
  
  // Clean up starting emojis or special chars
  const cleanTitle = rawTitle.replace(/^[^\w\s\u00C0-\u024F]+/, '').trim();
  const labelMatch = cleanTitle.match(/^(Problema\s*resuelto\s*[\d.]*)(?::|-)?\s*(.*)/i);
  
  if (labelMatch) {
    problemLabel = labelMatch[1].trim();
    mainTitle = labelMatch[2].trim() || rawTitle;
  }

  let remaining = content;
  if (titleMatch) {
    remaining = remaining.replace(titleMatch[0], '').trim();
  }

  let respuesta = '';
  const respuestaSplit = remaining.split(/\*\*Respuesta:\*\*/);
  if (respuestaSplit.length > 1) {
    respuesta = respuestaSplit.pop()!.trim();
    remaining = respuestaSplit.join('**Respuesta:**').trim();
  }

  let enunciado = '';
  let solucion = '';

  const solucionHeaderMatch = remaining.match(/\*\*(?:Solución|Solución paso a paso):\*\*/);
  if (solucionHeaderMatch) {
    const splitIndex = solucionHeaderMatch.index!;
    enunciado = remaining.substring(0, splitIndex).trim();
    solucion = remaining.substring(splitIndex + solucionHeaderMatch[0].length).trim();
  } else {
    const firstStepMatch = remaining.match(/(?:^|\n)\s*\d+\.\s+/);
    if (firstStepMatch) {
      const splitIndex = firstStepMatch.index!;
      enunciado = remaining.substring(0, splitIndex).trim();
      solucion = remaining.substring(splitIndex).trim();
    } else {
      enunciado = remaining;
    }
  }

  if (enunciado.startsWith('**Enunciado:**')) {
    enunciado = enunciado.substring('**Enunciado:**'.length).trim();
  }

  const markdownComponents = {
    p: ({node, ...props}: any) => <div {...props} className="mb-3 last:mb-0 leading-relaxed max-w-full break-words" />,
    a: ({node, ...props}: any) => <a {...props} className="text-[#735c00] underline break-words" />,
    code: ({node, inline, className, children, ...props}: any) => {
      const isBlock = !inline || (typeof children === 'string' && children.includes('\n'));
      if (isBlock) {
        return (
          <div className="w-full overflow-x-auto my-4 bg-white/60 rounded-xl border border-[#735c00]/30 shadow-sm">
            <pre className="px-6 py-4 min-w-fit text-center">
              <code className={`font-mono text-[#735c00] text-sm md:text-base font-medium ${className || ''}`} {...props}>
                {children}
              </code>
            </pre>
          </div>
        );
      }
      return (
        <code className="font-mono text-[15px] bg-white/60 border border-[#735c00]/20 px-2 py-0.5 rounded-md text-[#735c00] font-medium tracking-wide break-words whitespace-pre-wrap shadow-sm mx-0.5" {...props}>
          {children}
        </code>
      );
    }
  };

  const katexBlockStyle = "[&_.katex-display]:my-4 [&_.katex-display]:py-4 [&_.katex-display]:px-6 [&_.katex-display]:bg-white/60 [&_.katex-display]:border [&_.katex-display]:border-[#735c00]/30 [&_.katex-display]:rounded-xl [&_.katex-display]:shadow-sm [&_.katex-display]:overflow-x-auto [&_.katex-display]:block [&_.katex-display]:text-center";

  const renderSolucion = () => {
    const steps = solucion.split(/\n(?=\s*\d+\.\s+\*\*)/).map(s => s.trim()).filter(Boolean);
    
    if (steps.length > 0 && steps[0].match(/^\s*\d+\.\s+\*\*/)) {
      return (
        <ol className="space-y-6 w-full">
          {steps.map((step, idx) => {
            const stepMatch = step.match(/^\s*(\d+)\.\s+\*\*(.*?)\*\*(.*)/s);
            if (stepMatch) {
              const num = stepMatch[1];
              const name = stepMatch[2];
              const desc = stepMatch[3].trim();
              
              return (
                <li key={idx} className="flex flex-col sm:flex-row items-start gap-4 min-w-0 w-full">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#735c00] flex items-center justify-center bg-[#fcf9f0] text-[#735c00] font-sans font-bold text-[12px] uppercase tracking-[0.1em] leading-none pt-0.5">
                    {num.padStart(2, '0')}
                  </div>
                  <div className="flex-1 w-full min-w-0 pt-1">
                    <span className="font-semibold text-[#1c1c17] block mb-1 break-words">{name}</span>
                    <div className={`font-sans text-[18px] text-[#1c1c17] break-words w-full min-w-0 ${katexBlockStyle}`}>
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath]} 
                        rehypePlugins={[rehypeKatex]} 
                        components={markdownComponents}
                      >
                        {desc}
                      </ReactMarkdown>
                    </div>
                  </div>
                </li>
              );
            }
            return (
              <li key={idx} className={`font-sans text-[18px] text-[#1c1c17] break-words w-full min-w-0 ${katexBlockStyle}`}>
                 <ReactMarkdown 
                    remarkPlugins={[remarkMath]} 
                    rehypePlugins={[rehypeKatex]} 
                    components={markdownComponents}
                  >
                    {step}
                  </ReactMarkdown>
              </li>
            );
          })}
        </ol>
      );
    }

    return (
      <div className={`font-sans text-[18px] text-[#1c1c17] break-words w-full min-w-0 ${katexBlockStyle}`}>
        <ReactMarkdown 
          remarkPlugins={[remarkMath]} 
          rehypePlugins={[rehypeKatex]} 
          components={{...markdownComponents,
            ol: ({node, ...props}: any) => <ol {...props} className="space-y-4 w-full list-decimal pl-6" />,
            li: ({node, ...props}: any) => <li {...props} className="w-full min-w-0" />
          }}
        >
          {solucion}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <main className="w-full relative group my-12 mx-auto" style={{ maxWidth: '48rem' }}>
      <div aria-hidden="true" className="absolute -inset-1 bg-[#735c00] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 rounded-xl"></div>
      
      <article className="relative border border-[#735c00]/20 rounded-xl shadow-lg p-6 md:p-12 transition-all duration-500 hover:border-[#735c00]/60 bg-[#fcf9f0] w-full overflow-hidden" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E')` }}>
        
        <header className="mb-10 text-center w-full">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 border border-[#735c00]/40 rounded-full bg-[#fed65b]/20 shadow-sm">
            <Sparkles className="text-[#735c00] w-4 h-4 fill-[#735c00]" />
            <span className="font-sans font-bold text-[12px] text-[#735c00] tracking-[0.1em] uppercase leading-none pt-0.5">
              {problemLabel}
            </span>
          </div>
          <h1 className="font-serif text-[28px] md:text-[32px] font-medium leading-[1.2] text-[#000000] mb-6 break-words">
            {mainTitle}
          </h1>
          
          <div className="flex items-center justify-center gap-4 my-8 opacity-60">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#735c00]"></div>
            <Circle className="text-[#735c00] w-3 h-3 fill-current" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#735c00]"></div>
          </div>
        </header>

        {enunciado && (
          <section className="mb-10 bg-[#f6f3ea] p-6 rounded border-l-4 border-[#735c00]/50 shadow-sm relative w-full overflow-hidden">
            <h2 className="font-serif text-[20px] leading-[1.4] tracking-[0.05em] font-semibold text-[#45474d] mb-2">Enunciado:</h2>
            <div className={`font-sans text-[18px] text-[#1c1c17] break-words w-full min-w-0 ${katexBlockStyle}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkMath]} 
                rehypePlugins={[rehypeKatex]} 
                components={markdownComponents}
              >
                {enunciado}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {solucion && (
          <section className="mb-10 w-full overflow-hidden">
            <h3 className="font-serif text-[20px] leading-[1.4] tracking-[0.05em] font-semibold text-[#000000] mb-6 border-b border-[#c5c6cd]/30 pb-2">Resolución Analítica</h3>
            {renderSolucion()}
          </section>
        )}

        {respuesta && (
          <footer className="mt-12 bg-[#ebe8df] border border-[#735c00]/30 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center gap-4 relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#735c00]"></div>
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#735c00]/10 flex items-center justify-center border border-[#735c00]/20">
              <CheckCircle className="text-[#735c00] w-6 h-6 stroke-[2]" fill="currentColor" opacity={0.2} />
              <CheckCircle className="text-[#735c00] w-6 h-6 stroke-[2] absolute" />
            </div>
            <div className="flex-1 w-full min-w-0">
              <span className="font-sans font-bold text-[12px] leading-none tracking-[0.1em] text-[#45474d] uppercase block mb-1">Respuesta Final</span>
              <div className={`font-serif text-[20px] leading-[1.4] tracking-[0.05em] font-medium text-[#000000] break-words w-full min-w-0 ${katexBlockStyle}`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkMath]} 
                  rehypePlugins={[rehypeKatex]} 
                  components={markdownComponents}
                >
                  {respuesta}
                </ReactMarkdown>
              </div>
            </div>
          </footer>
        )}
      </article>
    </main>
  );
}

