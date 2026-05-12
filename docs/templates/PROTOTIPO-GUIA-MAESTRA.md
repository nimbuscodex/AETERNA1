# 📜 Modelo Maestro: El Método Aeterna (Instrucción de Estructura)

Este documento define la sintaxis para que el sistema genere **índices dinámicos** y contenidos multinivel. Cada sección del artículo debe seguir este bloque de construcción triple.

---

## 1. Mapeo de Índices (Títulos por Capa)
Para que el índice lateral (TOC) cambie según el nivel, cada sección debe declarar sus tres identidades. En el archivo final (JSON), esto se mapea en el objeto `titulo`.

### 🧱 Bloque de Sección [ID-UNICO]
**Definición de Títulos para el Índice:**
- **Título P (Principiante)**: `Hito I: Nombre Simple` (Aparece en Capa I)
- **Título I (Intermedio)**: `Exégesis I: Nombre Técnico` (Aparece en Capa II)
- **Título A (Avanzado)**: `Axioma I: Nombre Científico` (Aparece en Capa III)

---

## 2. Desarrollo de Contenidos por Capa

Dentro de cada bloque de sección, el contenido se divide mediante etiquetas de nivel. El sistema solo renderizará la etiqueta correspondiente a la "Capa" activa del usuario.

### 🟢 CONTENIDO: CAPA I (Iniciación)
> **Enfoque**: Conceptual, analógico, visual.
> **Instrucción**: Explicar el "qué" sin entrar en el "cómo" matemático. Usar `<BotonTransicion nivel="intermedio">` al final.

### 🔵 CONTENIDO: CAPA II (Exégesis)
> **Enfoque**: Técnico, causal, procedimental.
> **Instrucción**: Explicar el "cómo". Introducir terminología técnica y cuadros de engagement. Usar `<BotonTransicion nivel="avanzado">` al final.

### 🟣 CONTENIDO: CAPA III (Frontera)
> **Enfoque**: Axiomático, matemático, experimental.
> **Instrucción**: Fórmulas densas, demostraciones y profundidad filosófica.

---

## 3. Ejemplo Práctico de Instrucción

Si estás escribiendo sobre "La Gravedad", tu instrucción Markdown para una sección sería:

### [Sección: gravedad-newton]
- **T_P**: La Caída de la Manzana
- **T_I**: Ley de Gravitación Universal
- **T_A**: El Campo Gravitatorio Escalar

**Capa I**: Imagina que la Tierra es un imán gigante...
**Capa II**: La fuerza es directamente proporcional al producto de las masas...
**Capa III**: $$ F = G \frac{m_1 m_2}{r^2} $$ ...

---

## 4. Resumen de Flujo para el Motor
1. **Detección de Nivel**: El usuario selecciona "Capa II".
2. **Filtrado de Índice**: El sistema busca todos los campos `titulo.intermedio` (T_I) y construye el menú lateral.
3. **Filtrado de Cuerpo**: El sistema busca todos los campos `niveles.intermedio` y renderiza el artículo.
4. **Sincronización**: Si no existe contenido para ese nivel, se busca un "fallback" al nivel inferior.
