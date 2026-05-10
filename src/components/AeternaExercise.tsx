import React, { useState } from 'react';
import { Pencil, Circle, CheckCircle, Lightbulb, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useGamification } from '@/context/GamificationContext';

interface Props {
  content: string;
}

export function AeternaExercise({ content }: Props) {
  // Parsing the content
  const labelMatch = content.match(/(?:LABEL):\s*(.*)/i) || content.match(/\*\*(Ejercicio\s*\d+)\*\*:/i) || content.match(/\*\*(Ejercicio\s*\d+):\*\*/i);
  const label = labelMatch ? labelMatch[1] : `ejercicio_${content.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '')}`;
  
  const pistaMatch = content.match(/PISTA:\s*(.*)/i);
  const pista = pistaMatch ? pistaMatch[1].trim() : 'Identifica primero todos los datos que te proporciona el enunciado e intenta recordar qué fórmula relaciona esos valores.';

  const respuestaMatch = content.match(/RESPUESTA_CORRECTA:\s*(.*)/i);
  const respuestaCorrecta = respuestaMatch ? respuestaMatch[1].trim() : '';

  const textBody = content
    .replace(/(?:LABEL):\s*.*\n?/i, '')
    .replace(/\*\*(Ejercicio\s*\d+)\*\*:\s*/i, '')
    .replace(/\*\*(Ejercicio\s*\d+):\*\*\s*/i, '')
    .replace(/PISTA:\s*.*\n?/i, '')
    .replace(/RESPUESTA_CORRECTA:\s*.*\n?/i, '')
    .trim();

  // If this is a solution (contains = or ≈), we adapt the header
  const isSolution = textBody.includes('=') || textBody.includes('≈') || textBody.includes('→');

  const { markQuestionAnswered, hasAnsweredQuestion, addXP } = useGamification();
  const [answerContent, setAnswerContent] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Create a unique ID for this question
  const path = typeof window !== 'undefined' ? window.location.pathname : 'path';
  const questionId = `${path}_${label.replace(/\s+/g, '_')}`;
  
  const [isCorrect, setIsCorrect] = useState(() => hasAnsweredQuestion(questionId));

  // Sync isCorrect if hasAnsweredQuestion becomes true from elsewhere
  React.useEffect(() => {
    if (hasAnsweredQuestion(questionId)) {
      setIsCorrect(true);
    }
  }, [hasAnsweredQuestion, questionId]);

  const handleCheckAnswer = () => {
    if (isCorrect) return;
    setErrorMsg('');
    if (respuestaCorrecta && answerContent.toLowerCase().includes(respuestaCorrecta.toLowerCase())) {
      setIsCorrect(true);
      markQuestionAnswered(questionId, 50, 'Ejercicio resuelto');
    } else if (!respuestaCorrecta && answerContent.length > 5) {
      setIsCorrect(true);
      markQuestionAnswered(questionId, 50, 'Ejercicio resuelto');
    } else {
      setErrorMsg('Respuesta incorrecta. Revisa tu proceso y mira la pista.');
      setShowHint(true);
    }
  };

  const markdownComponents = {
    p: ({node, ...props}: any) => <div {...props} className="mb-3 last:mb-0 leading-relaxed max-w-full break-words" />,
    a: ({node, ...props}: any) => <a {...props} className="text-[#735c00] underline break-words" />,
    ol: ({node, ...props}: any) => <ol {...props} className="space-y-4 w-full list-decimal pl-6" />,
    ul: ({node, ...props}: any) => <ul {...props} className="space-y-4 w-full list-disc pl-6" />,
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

  return (
    <main className="w-full relative group my-12 mx-auto" style={{ maxWidth: '48rem' }}>
      <div aria-hidden="true" className="absolute -inset-1 bg-[#735c00] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 rounded-xl"></div>
      
      <article className="relative border border-[#735c00]/20 rounded-xl shadow-lg p-6 md:p-12 transition-all duration-500 hover:border-[#735c00]/60 bg-[#fcf9f0] w-full overflow-hidden" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E')` }}>
        
        <header className="mb-10 text-center w-full">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            {isSolution ? (
              <CheckCircle className="text-[#735c00] w-5 h-5 fill-[#735c00]/20 stroke-[1.5]" />
            ) : (
              <Pencil className="text-[#735c00] w-5 h-5 fill-[#735c00]/20 stroke-[1.5]" />
            )}
            <span className="font-sans font-bold text-[12px] text-[#735c00] tracking-[0.1em] uppercase leading-none pt-0.5">
              {isSolution ? 'Solución Analítica' : 'Ejercicio Propuesto'}
            </span>
          </div>
          <h1 className="font-serif text-[28px] md:text-[40px] font-medium leading-[1.2] text-[#000000] mb-6 break-words">
            {label.replace(':', '')}
          </h1>
          
          <div className="flex items-center justify-center gap-4 my-8 opacity-60">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#735c00]"></div>
            <Circle className="text-[#735c00] w-3 h-3 fill-current" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#735c00]"></div>
          </div>
        </header>

        {isSolution ? (
          <section className="mb-2 w-full overflow-hidden">
            <div className={`font-sans text-[18px] text-[#1c1c17] break-words w-full min-w-0 ${katexBlockStyle}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkMath]} 
                rehypePlugins={[rehypeKatex]} 
                components={markdownComponents}
              >
                {textBody}
              </ReactMarkdown>
            </div>
          </section>
        ) : (
          <section className="mb-2 bg-[#f6f3ea] p-6 rounded border-l-4 border-[#735c00]/50 shadow-sm relative w-full overflow-hidden">
            <div className={`font-sans text-[18px] text-[#1c1c17] break-words w-full min-w-0 ${katexBlockStyle}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkMath]} 
                rehypePlugins={[rehypeKatex]} 
                components={markdownComponents}
              >
                {textBody}
              </ReactMarkdown>
            </div>
            
            <div className="mt-8 flex flex-col gap-4">
              <div className="relative">
                <textarea 
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#735c00]/20 bg-white/50 focus:bg-white focus:outline-none focus:border-[#735c00]/50 transition-colors resize-y min-h-[120px] font-sans text-[16px] text-[#1c1c17]"
                  placeholder="Escribe tu proceso y respuesta aquí..."
                />
              </div>
              
              {errorMsg && !isCorrect && (
                <div className="text-red-600 text-sm font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-end items-center border-t border-[#735c00]/10 pt-4 mt-2">
                <button 
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#735c00] hover:bg-[#735c00]/10 rounded-lg transition-colors sm:mr-auto w-full sm:w-auto justify-center"
                >
                  <Lightbulb size={18} />
                  <span>{showHint ? 'Ocultar pista' : 'Necesito una pista'}</span>
                </button>
                <button 
                  onClick={handleCheckAnswer}
                  className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 w-full sm:w-auto justify-center ${
                    isCorrect ? 'bg-green-600 hover:bg-green-700 cursor-default' : 'bg-[#735c00] hover:bg-[#5a4800]'
                  }`}
                >
                  {isCorrect ? <CheckCircle size={18} fill="currentColor" className="text-white" /> : <Star size={18} fill="currentColor" />}
                  <span>{isCorrect ? '¡Completado!' : '+50 EXP'}</span>
                </button>
              </div>
              
              {showHint && (
                <div className="mt-2 p-4 bg-white/60 border border-[#735c00]/20 rounded-xl text-sm font-sans text-[#45474d] animate-in fade-in slide-in-from-top-2 duration-300">
                  <strong className="text-[#735c00] font-semibold block mb-1">Pista:</strong>
                  {pista}
                </div>
              )}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
