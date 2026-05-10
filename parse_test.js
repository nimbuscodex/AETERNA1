const content = `TITLE: 1.1: La radio FM

**Enunciado:** Una emisora de radio FM emite en la frecuencia de 100 MHz (100 × 10⁶ Hz). Las ondas de radio viajan a la velocidad de la luz (c = 3 × 10⁸ m/s). ¿Cuál es su longitud de onda?

**Solución paso a paso:**

01. **Datos:** f = 100 × 10⁶ Hz, v = 3 × 10⁸ m/s.
02. **Fórmula:** La relación entre velocidad, frecuencia y longitud de onda es \`v = λ · f\`.
03. **Despeje:** Queremos calcular λ, así que despejamos: \`λ = v / f\`.
04. **Sustitución y cálculo:** \`λ = (3 × 10⁸ m/s) / (100 × 10⁶ Hz) = 3 m\`.

**Respuesta:** La longitud de onda de una emisora de FM a 100 MHz es de **3 metros**. Las antenas de los coches suelen medir cerca.`;

  const titleMatch = content.match(/TITLE:\s*(.*)/);
  const title = titleMatch ? titleMatch[1] : 'Problema resuelto';

  const enunciadoMatch = content.match(/\*\*Enunciado:\*\*\s*([\s\S]*?)(?=\n\n\*\*Solución paso a paso:)/);
  const enunciado = enunciadoMatch ? enunciadoMatch[1].trim() : '';

  const solucionMatch = content.match(/\*\*Solución paso a paso:\*\*\s*([\s\S]*?)(?=\n\n\*\*Respuesta:)/);
  const solucion = solucionMatch ? solucionMatch[1].trim() : '';

  const respuestaMatch = content.match(/\*\*Respuesta:\*\*\s*([\s\S]*?)$/);
  const respuesta = respuestaMatch ? respuestaMatch[1].trim() : '';

console.log({title, enunciado: enunciado, solucion: solucion, respuesta});
