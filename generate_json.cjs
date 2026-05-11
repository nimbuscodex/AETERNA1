const fs = require('fs');

const data = {
  "metadata": {
    "title": "Física Atómica y Nuclear: La Exégesis de la Materia",
    "description": "Una inmersión profunda en la arquitectura de lo invisible, desde los modelos clásicos hasta la mecánica cuántica que rige el corazón de las estrellas.",
    "slug": "fisica-atomica-y-nuclear",
    "author": "Aeterna",
    "category": "ciencias",
    "subcategory": "fisica",
    "tags": [
      "física",
      "átomo",
      "núcleo",
      "radiactividad",
      "fisión",
      "fusión",
      "cuántica",
      "Aeterna Gold"
    ],
    "image": "https://images.unsplash.com/photo-1569788497016-40b2b4b6d62b?q=80&w=2070&auto=format&fit=crop",
    "date": "2026-05-11",
    "nivel": "1",
    "insignia": "Visionario del Átomo",
    "tipo": "theory"
  },
  "introduccion": "Bienvenido al archivo sobre la **Física Atómica y Nuclear**. Todo lo que ves, tocas y respiras está construido con ladrillos microscópicos que desafían el sentido común. En esta exégesis, descenderemos capa por capa hasta el corazón de la materia para entender cómo se libera la energía que hace brillar al Sol y cómo esa misma fuerza ha cambiado la historia de la humanidad. Prepárate para abandonar la intuición macroscópica y adentrarte en un reino donde la probabilidad, el espín y la energía pura dictan las leyes de la existencia. Nos encontramos ante la arquitectura misma de la creación, un tapiz tejido con hilos de fuerza fuerte y campos de probabilidad cuántica.",
  "secciones": [
    {
      "id": "p1-arquitectura-invisible",
      "titulo": "Principiante: La Arquitectura de lo Invisible",
      "niveles": {
        "principiante": "Imagina que sostienes un trozo de hierro y lo divides por la mitad. Luego divides esa mitad, y la siguiente, y así sucesivamente en una búsqueda infinita hacia lo pequeño. ¿Existe un límite último para la materia? Demócrito, en la bruma de la Grecia antigua, postuló que eventualmente llegaríamos a una partícula indivisible llamada *átomo*. Aunque la ciencia moderna ha revelado que el átomo tiene una estructura interna compleja y fascinante, su nombre sigue siendo el pilar fundamental de nuestra ontología física.\n\nLa realidad a esta escala es profundamente paradójica: un átomo es casi un 99.999% **espacio vacío**. Si el núcleo atómico fuera una pequeña canica en el centro exacto de un estadio monumental de fútbol, los electrones serían como abejas zumbando erráticamente en las filas más altas de las gradas, dejando un inmenso vacío intermedio. Lo que percibes como la \"solidez\" de un muro de piedra o la dureza de un diamante no es más que la repulsión eléctrica entre los electrones de tu propia mano y los del objeto. No tocamos la materia en sí; experimentamos la colisión de sus campos de fuerza.\n\n> 💡 **Idea clave**\n> La materia es energía condensada. El vacío no es la ausencia de todo, sino el escenario donde la energía baila en patrones específicos que percibimos como solidez debido a las leyes del electromagnetismo.\n\n### Los Componentes Primordiales\nCada átomo es un microsistema en equilibrio perfecto, sostenido por tres entidades que desafían nuestra escala humana:\n1. **Protones:** Habitantes soberanos del núcleo con carga positiva. Son los que determinan la identidad química del elemento; el número de protones es el 'DNI' del átomo.\n2. **Neutrones:** Compañeros silenciosos en el núcleo, desprovistos de carga eléctrica. Actúan como estabilizadores, aportando la masa necesaria para que la fuerza fuerte mantenga todo unido.\n3. **Electrones:** Portadores de carga negativa que envuelven al núcleo en una danza perpetua, moviéndose a velocidades que desafían la imaginación."
      },
      "acciones": [
        {
          "tipo": "BotonProfundizar",
          "contenido": "Si comprimiéramos a toda la raza humana eliminando el inmenso espacio vacío entre sus átomos, los 8.000 millones de personas cabríamos en el espacio de una manzana, manteniendo toda nuestra masa original. Seríamos una manzana de una densidad astronómica, similar a la de una estrella de neutrones."
        }
      ]
    },
    {
      "id": "i1-modelos-atomicos-historia",
      "titulo": "Intermedio: De las Esferas de Dalton al Átomo de Bohr",
      "niveles": {
        "intermedio": "La historia del átomo es la crónica de cómo la humanidad aprendió a ver lo invisible a través de la razón y el experimento. No ha sido un ascenso lineal hacia la verdad, sino una sucesión de paradigmas rotos y reconstruidos.\n\n- **Dalton (1803):** Revisitó la idea griega, proponiendo átomos como esferas macizas, eternas e indivisibles. Para él, eran como bolas de billar microscópicas que se combinaban en proporciones fijas.\n- **Thomson (1897):** El descubrimiento del electrón rompió la idea de la indivisibilidad. Imaginó el 'Modelo del Pudín de Pasas': una masa de carga positiva con electrones (pasas) incrustados. Fue el primer reconocimiento de que el átomo tenía partes constituyentes.\n- **Rutherford (1911):** En una hazaña que cambió la física para siempre, bombardeó una finísima lámina de oro con partículas alfa. Al observar que algunas partículas rebotaban directamente hacia la fuente, concluyó que el átomo debía tener un núcleo central denso, diminuto y cargado positivamente. \"Fue como si dispararas una bala de 15 pulgadas a un trozo de papel de seda y volviera a golpearte\", escribió asombrado.\n- **Bohr (1913):** Introdujo el concepto de cuantización. Los electrones no pueden orbitan en cualquier lugar, sino solo en niveles de energía específicos y permitidos. Para saltar de una órbita a otra, el electrón debe emitir o absorber un fotón con la energía exacta de la diferencia entre niveles. Este es el origen del término **salto cuántico**, una transición instantánea que ignora el espacio intermedio.\n\nEstos modelos no solo fueron ejercicios teóricos; explicaron por qué cada elemento emite una firma de luz única (espectros), permitiéndonos saber de qué están hechas las estrellas sin necesidad de viajar a ellas."
      },
      "acciones": [
        {
          "tipo": "BotonProfundizar",
          "contenido": "El experimento de Rutherford es el prototipo de la física de partículas moderna: colisionar cosas a energías extremas para ver qué hay dentro. Hoy lo hacemos en el Gran Colisionador de Hadrones (LHC)."
        }
      ]
    },
    {
      "id": "a1-exegesis-schrodinger",
      "titulo": "Avanzado: La Ecuación de Schrödinger y la Nube de Probabilidad",
      "niveles": {
        "avanzado": "Superando las órbitas deterministas de Bohr, la mecánica cuántica moderna describe al electrón no como un punto material con una trayectoria definida, sino como una función de onda matemática. La realidad en esta escala se vuelve intrínsecamente borrosa, sujeta al **Principio de Incertidumbre de Heisenberg**, que nos prohíbe conocer simultáneamente con precisión absoluta la posición y el momento de una partícula.\n\nLa herramienta fundamental de esta descripción es la **Ecuación de Schrödinger**:\n\n$$\\hat{H}\\Psi = E\\Psi$$\n\nDonde:\n- $\\hat{H}$ representa el operador Hamiltoniano, que codifica la energía total (cinética y potencial) del sistema.\n- $\\Psi$ (Psi) es la función de onda, cuya magnitud al cuadrado ($|\\Psi|^2$) nos da la densidad de probabilidad de encontrar al electrón en un punto dado.\n- $E$ es la energía cuantizada del estado.\n\nAl resolver esta ecuación para el átomo de hidrógeno, los físicos descubrieron que los electrones no habitan órbitas, sino **orbitales**: volúmenes de espacio con formas geométricas complejas (esferas, lóbulos, toroides) donde el electrón reside como una nube de probabilidad estática.\n\n### Los Números Cuánticos y la Exclusión\nLa arquitectura electrónica se define por cuatro parámetros:\n1. **$n$ (Principal):** El nivel de energía principal.\n2. **$l$ (Acimutal):** Define la forma del orbital (momento angular).\n3. **$m_l$ (Magnético):** Define la orientación espacial del orbital ante un campo magnético.\n4. **$m_s$ (Espín):** Una propiedad cuántica intrínseca que solo puede ser +1/2 o -1/2.\n\nEl **Principio de Exclusión de Pauli** es la ley constitucional de la materia: prohíbe que dos fermiones (como los electrones) ocupen exactamente el mismo estado cuántico. Sin esta regla, todos los electrones colapsarían al nivel de energía más bajo, la química desaparecería y la materia sólida dejaría de existir."
      },
      "acciones": []
    },
    {
      "id": "a1-dirac-estructura-fina",
      "titulo": "Avanzado: Estructura Fina y la Constante de Estructura Fina",
      "niveles": {
        "avanzado": "La exégesis cuántica se vuelve aún más profunda cuando introducimos la Relatividad Especial de Einstein en el mundo atómico. Paul Dirac fue el primero en formular una versión relativista de la mecánica cuántica, lo que llevó al descubrimiento de la **Estructura Fina**.\n\nLa estructura fina es el desdoblamiento de las líneas espectrales debido a dos efectos principales:\n1. **Acoplamiento Espín-Órbita:** El electrón, al moverse en el campo eléctrico del núcleo, experimenta un campo magnético efectivo que interactúa con su propio momento magnético intrínseco (espín).\n2. **Correcciones Relativistas:** A medida que los electrones se mueven a fracciones significativas de la velocidad de la luz en átomos pesados, su masa efectiva aumenta, alterando sus niveles de energía.\n\nEl parámetro que gobierna estas interacciones es la **Constante de Estructura Fina ($\\alpha$):**\n$$\\alpha = \\frac{e^2}{\\hbar c} \\approx \\frac{1}{137}$$\nEste número puro, sin dimensiones, es uno de los mayores misterios de la física. Richard Feynman lo llamó \"el mayor misterio de la física: un número mágico que nos llega sin que nadie lo entienda\". Si $\\alpha$ fuera ligeramente diferente, las estrellas no podrían brillar o los átomos no podrían formar moléculas complejas."
      },
      "acciones": []
    },
    {
      "id": "p2-corazon-nucleo",
      "titulo": "Principiante: El Núcleo, el Corazón del Átomo",
      "niveles": {
        "principiante": "Si el átomo es un inmenso vacío, el núcleo es su sol denso y poderoso. Aunque su tamaño es despreciable comparado con el átomo completo (es 100.000 veces más pequeño), concentra el 99.9% de toda la masa. La densidad nuclear es tan extrema que una cantidad de materia nuclear del tamaño de un terrón de azúcar pesaría lo mismo que todos los coches de la Tierra juntos.\n\nEn este corazón residen los protones (positivos) y los neutrones (neutros). Aquí surge un enigma: dado que las cargas iguales se repelen, ¿por qué los protones no salen disparados destrozando el átomo? La respuesta es la **Fuerza Nuclear Fuerte**.\n\nEsta fuerza es el pegamento definitivo del cosmos. Es la más intensa de las cuatro fuerzas fundamentales, siendo 100 veces más fuerte que la electricidad. Sin embargo, tiene una limitación crítica: su alcance es infinitesimal. Solo funciona cuando los nucleones están prácticamente tocándose.\n\n> 💡 **La Analogía del Pegamento Cuántico**\n> Imagina que los protones son pelotas de tenis recubiertas de un pegamento que solo pega si las pelotas se comprimen una contra otra. Una vez que el pegamento hace contacto, la unión es tan fuerte que nada puede separarlas, superando cualquier otra repulsión."
      },
      "acciones": []
    },
    {
      "id": "i2-isotopos-estabilidad",
      "titulo": "Intermedio: Isótopos y la Estabilidad del Núcleo",
      "niveles": {
        "intermedio": "El número de protones define qué elemento es un átomo (por ejemplo, el Oro siempre tiene 79 protones). Sin embargo, el número de neutrones puede variar libremente dentro de ciertos límites. Estas variantes se denominan **Isótopos**.\n\n- **Carbono-12:** Estable, base de la vida orgánica.\n- **Carbono-14:** Inestable, radiactivo, esencial para la arqueología.\n\nLa estabilidad nuclear depende de la proporción entre neutrones y protones. Si hay demasiados de uno u otro, la fuerza fuerte no puede competir con la repulsión eléctrica y el núcleo se vuelve inestable. Los núcleos buscan la paz a través de la radiactividad, transformándose en otros elementos más equilibrados. Este proceso de cambio es la transmutación que los antiguos alquimistas soñaban, pero ejecutada por la propia naturaleza."
      },
      "acciones": [
        {
          "tipo": "BotonEjemplos",
          "contenido": "- **Hidrógeno (Protio):** 1 protón, 0 neutrones. El 99.98% del hidrógeno del universo.\n- **Deuterio:** 1 protón, 1 neutrón. Presente en el 'agua pesada'.\n- **Tritio:** 1 protón, 2 neutrones. Es radiactivo y se usa en investigación y armas nucleares."
        }
      ]
    },
    {
      "id": "a2-modelo-capas-magicos",
      "titulo": "Avanzado: El Modelo de Capas y los Números Mágicos",
      "niveles": {
        "avanzado": "El núcleo no es una amalgama amorfa, sino un sistema organizado donde los nucleones llenan 'capas' cuánticas.\n\nCuando una de estas capas se completa, el núcleo adquiere una estabilidad extraordinaria. Los números de nucleones que cierran estas capas se conocen como **Números Mágicos**: 2, 8, 20, 28, 50, 82 y 126. Por ejemplo, el Helio-4 (2 protones, 2 neutrones) es \"doblemente mágico\" y extremadamente estable.\n\nPara justificar estos niveles, se requiere un potencial central (como el de Woods-Saxon) corregido por un fortísimo **acoplamiento espín-órbita**. A diferencia de los electrones, donde este acoplamiento es un efecto pequeño, en el núcleo es la fuerza dominante que redefine los niveles de energía y explica por qué existen estos números mágicos específicos. Este descubrimiento, realizado por Maria Goeppert-Mayer, fue fundamental para entender la abundancia de los elementos en el universo."
      },
      "acciones": []
    },
    {
      "id": "i2-gas-fermi-nuclear",
      "titulo": "Intermedio/Avanzado: El Modelo del Gas de Fermi",
      "niveles": {
        "avanzado": "Una aproximación alternativa para entender el núcleo es el **Modelo del Gas de Fermi**. En este modelo, tratamos a los nucleones como un gas de fermiones atrapados en un pozo de potencial profundo. Debido al Principio de Exclusión de Pauli, los nucleones deben ocupar todos los estados de energía más bajos hasta un nivel máximo llamado **Energía de Fermi** ($E_F$).\n\nEste modelo explica de manera muy sencilla por qué los núcleos prefieren tener el mismo número de protones y neutrones ($N=Z$). Si intentas añadir más neutrones que protones, los neutrones extra tendrían que ocupar estados de energía mucho más altos (por encima del nivel de Fermi de los protones), lo que hace que el sistema sea menos estable. Es una lección de economía cuántica: la naturaleza siempre busca el estado de menor energía posible respetando las reglas de exclusión."
      },
      "acciones": []
    },
    {
      "id": "p3-transmutacion-radiactividad",
      "titulo": "Principiante: Radiactividad y la Transmutación de la Materia",
      "niveles": {
        "principiante": "Existen átomos que no conocen la paz. Son núcleos inestables que albergan un exceso de energía que no pueden contener. Para alcanzar la estabilidad, deben desprenderse de pedazos de sí mismos o ráfagas de energía pura. A este proceso espontáneo lo llamamos **Radiactividad**.\n\nEste fenómeno es la verdadera transmutación con la que soñaban los alquimistas: un elemento convirtiéndose en otro de forma natural.\n\n1. **Alfa (α):** El núcleo expulsa un paquete pesado de 2 protones y 2 neutrones. Es como si el átomo perdiera un gran lastre. Su alcance es corto: una hoja de papel o tu propia piel pueden detenerlo.\n2. **Beta (β):** Un neutrón se transforma mágicamente en un protón, liberando un electrón a velocidades increíbles. El átomo cambia de identidad química. Requiere una lámina de aluminio para ser detenido.\n3. **Gamma (γ):** No es materia, sino luz ultra-energética e invisible. Es el grito final de alivio de un núcleo que acaba de pasar por un cambio violento. Solo paredes gruesas de plomo o hormigón pueden frenar su paso.\n\nLa radiactividad es parte de la naturaleza. Estás rodeado de ella: en el potasio de los plátanos, en el granito de las montañas y en el aire que respiras."
      },
      "acciones": [
        {
          "tipo": "BotonProfundizar",
          "contenido": "Marie Curie, la madre de la radiactividad, dio su vida por este conocimiento. Sus cuadernos de laboratorio siguen siendo tan radiactivos hoy que deben guardarse en cajas de plomo y solo pueden consultarse con trajes de protección."
        }
      ]
    },
    {
      "id": "i3-ley-desintegracion-vida-media",
      "titulo": "Intermedio: La Ley de Desintegración y el Reloj Eterno",
      "niveles": {
        "intermedio": "La radiactividad es un evento gobernado por el azar puro en el nivel individual, pero por una precisión matemática absoluta en el nivel estadístico. No podemos predecir cuándo morirá un átomo concreto, pero podemos decir con exactitud cuándo habrá muerto la mitad de una muestra de miles de millones de ellos. Ese tiempo se llama **Vida Media** ($t_{1/2}$).\n\nLa ecuación que rige el paso del tiempo atómico es:\n\n$$N(t) = N_0 e^{-\\lambda t}$$\n\nDonde $\\lambda$ es la constante de decaimiento propia de cada isótopo. Esta constancia es lo que nos permite datar la historia de nuestro planeta:\n- **Carbono-14:** Su vida media de 5.730 años lo hace perfecto para rastrear la historia de la civilización humana y los restos biológicos.\n- **Uranio-238:** Con una vida media de 4.500 millones de años (la edad de la Tierra), es el cronómetro que usamos para medir el tiempo geológico y el origen de nuestro sistema solar."
      },
      "acciones": []
    },
    {
      "id": "a3-efecto-tunel-alfa",
      "titulo": "Avanzado: El Efecto Túnel y la Paradoja de Gamow",
      "niveles": {
        "avanzado": "La desintegración alfa planteó un dilema insalvable para la física clásica. Las partículas alfa atrapadas en el núcleo no tienen energía suficiente para superar la barrera de potencial de la fuerza fuerte. Según Newton, deberían estar atrapadas para siempre, como una pelota que no puede saltar una pared de tres metros.\n\nGeorge Gamow resolvió este misterio aplicando la mecánica cuántica: las partículas son también ondas. La función de onda de la partícula alfa no se detiene en seco al llegar a la barrera; se infiltra en ella, decreciendo exponencialmente. Existe una probabilidad pequeña pero real de que la partícula aparezca instantáneamente al otro lado. Esto es el **Efecto Túnel**.\n\nEsta probabilidad es extremadamente sensible a la altura y anchura de la barrera. Por eso, una pequeña variación en la energía de la partícula alfa puede resultar en vidas medias que van desde fracciones de segundo hasta miles de millones de años. Es la victoria de la probabilidad cuántica sobre el determinismo clásico."
      },
      "acciones": []
    },
    {
      "id": "p4-fision-fusion-energía",
      "titulo": "Principiante: Fisión y Fusión: El Poder de las Estrellas",
      "niveles": {
        "principiante": "Existen dos maneras fundamentales de extraer la energía colosal que el universo ha guardado en el núcleo de los átomos. Es el mismo poder que hace que las estrellas brillen y que puede alimentar civilizaciones enteras.\n\n1. **Fisión (Romper):** Consiste en bombardear un átomo muy pesado y cargado, como el Uranio-235, con un neutrón. El átomo se parte en dos mitades más ligeras, liberando una ráfaga de calor y más neutrones. Estos neutrones golpean a otros átomos de uranio, creando una **reacción en cadena**. Es la tecnología que usamos hoy en las centrales nucleares.\n2. **Fusión (Unir):** Es el proceso inverso y mucho más potente. Obligamos a dos átomos muy ligeros (como el Hidrógeno) a fundirse para formar uno más pesado (Helio). Para lograrlo, necesitamos condiciones extremas: temperaturas de millones de grados, como las que hay en el corazón del Sol.\n\n> 💡 **La Promesa del Futuro**\n> La fusión nuclear es considerada la \"energía definitiva\". No produce gases de efecto invernadero, sus residuos no son peligrosos a largo plazo y su combustible se encuentra en el agua de mar. Estamos en una carrera tecnológica para dominar este proceso en la Tierra."
      },
      "acciones": [
        {
          "tipo": "BotonEjemplos",
          "contenido": "Fisión = Centrales nucleares actuales que nos dan electricidad 24/7 sin CO2.\nFusión = El proyecto ITER, un sol artificial que estamos construyendo en Francia para aprender a generar energía limpia e ilimitada."
        }
      ]
    },
    {
      "id": "i4-emc2-alquimia-einstein",
      "titulo": "Intermedio: E=mc²: La Alquimia de Einstein",
      "niveles": {
        "intermedio": "La energía nuclear no surge de la nada, ni de simples enlaces químicos. Surge de la destrucción de la masa misma. En cualquier reacción nuclear (fisión o fusión), la masa de los productos finales es ligeramente inferior a la masa de los ingredientes iniciales. Esa pequeña diferencia se ha convertido en energía pura.\n\nAlbert Einstein codificó este secreto en la ecuación más famosa de la historia:\n\n$$E = mc^2$$\n\nComo la velocidad de la luz ($c$) es un número inmenso ($300.000$ km/s), al elevarla al cuadrado obtenemos un factor de conversión estratosférico. Esto significa que **un solo gramo de materia contiene la energía equivalente a la explosión de 20.000 toneladas de dinamita**.\n\nEn una central nuclear, usamos esta energía para hervir agua de manera extremadamente eficiente. El vapor resultante mueve turbinas gigantes que generan la electricidad que llega a tu hogar. Es una forma de alquimia moderna: convertir la esencia misma de la materia en luz y calor."
      },
      "acciones": []
    },
    {
      "id": "a4-gota-liquida-formula-weizsacker",
      "titulo": "Avanzado: El Modelo de la Gota Líquida y la Inestabilidad",
      "niveles": {
        "avanzado": "Para modelar procesos complejos como la fisión, Bohr y Gamow propusieron tratar al núcleo no como una estructura rígida, sino como una gota de fluido incompresible. En este **Modelo de la Gota Líquida**, la estabilidad nuclear se explica mediante la **Fórmula Semiempírica de Masa de Weizsäcker**.\n\nLa energía de enlace del núcleo se descompone en varios términos competitivos:\n- **Término de Volumen:** La atracción de la fuerza fuerte que aumenta con el número de nucleones.\n- **Término de Superficie:** Los nucleones en la superficie están menos ligados que los del interior (tensión superficial).\n- **Término de Coulomb:** La repulsión eléctrica entre los protones que intenta deshacer el núcleo.\n- **Término de Simetría:** Los núcleos prefieren tener el mismo número de protones y neutrones.\n\nCuando un núcleo pesado absorbe un neutrón, empieza a oscilar violentamente. Si la deformación supera un punto crítico, la repulsión de Coulomb vence a la tensión superficial de la fuerza fuerte y la 'gota' se parte en dos. Esta es la descripción física precisa de la fisión nuclear inducida."
      },
      "acciones": []
    },
    {
      "id": "a4-nucleosintesis-polvo-estrellas",
      "titulo": "Avanzado: Nucleosíntesis: La Forja de los Elementos",
      "niveles": {
        "avanzado": "El universo primitivo era una sopa monótona de Hidrógeno y Helio. La complejidad química que nos rodea fue forjada en los hornos termonucleares de las estrellas. Este proceso de creación de elementos se llama **Nucleosíntesis**.\n\nLas estrellas fusionan hidrógeno en helio, luego helio en carbono, y continúan la cadena hasta llegar al **Hierro-56**. El hierro representa un límite termodinámico insuperable: es el núcleo más estable que existe. Fusionar hierro no libera energía, sino que la consume.\n\nCuando una estrella masiva agota su combustible y llega al hierro, su núcleo colapsa bajo su propia gravedad en milisegundos. El rebote genera una explosión de **Supernova**. En ese instante de furia cósmica, se inyectan neutrones a tal velocidad que se forjan todos los elementos más pesados, como el oro, el platino y el uranio. Literalmente, cada átomo de tu cuerpo es un vestigio de una estrella que murió hace miles de millones de años. Somos el cosmos pensando sobre sí mismo."
      },
      "acciones": []
    },
    {
      "id": "a4-qcd-confinamiento",
      "titulo": "Avanzado: Cromodinámica Cuántica (QCD) y Confinamiento",
      "niveles": {
        "avanzado": "En el nivel más profundo de la física nuclear, encontramos que los protones y neutrones no son partículas elementales, sino que están compuestos por **quarks**. La teoría que describe su interacción es la **Cromodinámica Cuántica (QCD)**.\n\nLos quarks están unidos por el intercambio de **gluones**, las partículas mediadoras de la Fuerza Fuerte. A diferencia de cualquier otra fuerza, la fuerza entre quarks no disminuye con la distancia, sino que aumenta, de forma similar a una cuerda elástica. Esto se conoce como **Confinamiento de Color**: nunca verás un quark solo en la naturaleza; siempre están atrapados en grupos de tres (bariones) o parejas (mesones). La Fuerza Nuclear Fuerte que mantiene unido el núcleo es, en realidad, solo un residuo de esta interacción mucho más poderosa que ocurre dentro de los propios nucleones."
      },
      "acciones": []
    },
    {
      "id": "p5-aplicaciones-hogar-medicina",
      "titulo": "Principiante: El Átomo en tu Vida Cotidiana",
      "niveles": {
        "principiante": "La física nuclear no solo pertenece a los reactores o a las estrellas; está integrada en tu día a día de formas que quizás no sospechas:\n\n- **Detectores de Humo:** La mayoría contienen una minúscula cantidad de Americio-241. Su radiación ioniza el aire dentro del detector; cuando entra humo, la corriente eléctrica se interrumpe y suena la alarma.\n- **Medicina de Vanguardia:** Los escaneos PET inyectan partículas que emiten positrones para detectar cánceres en etapas tempranas. La radioterapia usa rayos gamma para destruir tumores con una precisión que salva miles de vidas al día.\n- **Conservación de Alimentos:** Algunos alimentos se exponen a radiación para matar bacterias y parásitos sin alterar su sabor ni su nutrición, permitiendo que lleguen a zonas con hambre de forma segura.\n- **Exploración Espacial:** Las sondas que viajan a los planetas exteriores (donde no llega la luz del sol para paneles solares) funcionan con generadores nucleares de larga duración."
      },
      "acciones": []
    },
    {
      "id": "i5-reactores-control-fuego",
      "titulo": "Intermedio: Reactores Nucleares: Domesticando el Fuego Atómico",
      "niveles": {
        "intermedio": "Un reactor nuclear es, en su esencia más pura, una caldera térmica de una eficiencia inigualable. El gran desafío tecnológico es mantener la reacción en cadena bajo un control absoluto. Para ello, utilizamos las **Barras de Control**.\n\nHechas de materiales como el boro o el cadmio, estas barras actúan como esponjas que absorben neutrones. \n- Si la reacción se acelera, bajamos las barras para 'enfriar' el proceso.\n- Si necesitamos más vapor para generar electricidad, las subimos ligeramente.\n\nEl objetivo es mantener el reactor en un estado de **Criticidad**, donde cada fisión produce exactamente una nueva fisión. A diferencia de lo que muestran las películas, el combustible en un reactor civil tiene una concentración de uranio demasiado baja para explotar como una bomba atómica. Los sistemas de seguridad modernos están diseñados para detenerse automáticamente ante cualquier fallo, siguiendo las leyes de la física en lugar de depender solo de la intervención humana."
      },
      "acciones": []
    },
    {
      "id": "p5-energia-medio-ambiente",
      "titulo": "Principiante/Intermedio: Energía Nuclear y Medio Ambiente",
      "niveles": {
        "intermedio": "En el debate sobre el cambio climático, la energía nuclear ocupa un lugar central y complejo. Es la única fuente de energía capaz de generar grandes cantidades de electricidad de manera constante (base de red) sin emitir dióxido de carbono (CO2) a la atmósfera.\n\nSin embargo, su legado es dual:\n1. **Ventaja:** Ayuda a frenar el calentamiento global al sustituir al carbón y al gas.\n2. **Desafío:** Produce residuos radiactivos que deben ser gestionados con extrema precaución durante miles de años en depósitos geológicos profundos.\n\nLa decisión de usar esta tecnología es un dilema de gestión de riesgos: ¿preferimos el riesgo inmediato y global del colapso climático o el riesgo localizado y gestionable de los residuos radiactivos? Es una pregunta que cada sociedad debe responder con datos en la mano."
      },
      "acciones": []
    },
    {
      "id": "a5-neutrinos-materia-oscura",
      "titulo": "Avanzado: Neutrinos y el Último Velo del Cosmos",
      "niveles": {
        "avanzado": "La física nuclear es hoy nuestra principal herramienta para explorar los misterios más oscuros del universo. Cada proceso nuclear en el Sol emite billones de **Neutrinos**, partículas elementales casi sin masa que no sienten la fuerza eléctrica ni la nuclear fuerte. \n\nEn este instante, miles de millones de neutrinos solares están atravesando cada centímetro de tu cuerpo y toda la masa de la Tierra a la velocidad de la luz sin interactuar con nada. Detectarlos requiere tanques de agua pura enterrados a kilómetros bajo tierra para evitar el ruido de otras partículas. Estudiar estas 'partículas fantasma' nos permite mirar directamente al centro del Sol y, quizás, resolver el enigma de la **Materia Oscura**, esa sustancia invisible que constituye la mayor parte de la masa de las galaxias pero que se resiste a ser detectada por medios convencionales."
      },
      "acciones": []
    },
    {
      "id": "c1-conclusion-legado",
      "titulo": "Intermedio: El Legado de Aeterna",
      "niveles": {
        "intermedio": "Has completado tu descenso a las profundidades de la materia. Desde el concepto filosófico del átomo hasta las ecuaciones cuánticas y la fragua estelar de las supernovas, has visto que la realidad es mucho más extraña, poderosa y hermosa de lo que sugieren nuestros sentidos.\n\nLa energía nuclear es el fuego de Prometeo de nuestra era: una fuerza divina que hemos arrebatado a las estrellas. Usarla para sanar, para iluminar el mundo o para impulsar naves hacia otros sistemas solares es nuestra mayor responsabilidad como especie. Recuerda siempre: eres un conjunto de átomos que ha aprendido a pensar sobre sí mismo. Eres el universo tomando conciencia de su propia estructura interna.\n\n> 🧠 **Sistema Aeterna**\n> Has descendido hasta lo más profundo de la materia. Has visto que lo sólido es ilusión y que la energía que alimenta el cosmos reside en el corazón de lo invisible. Tu integridad cognitiva ahora abarca la dualidad entre la creación estelar y la responsabilidad tecnológica. El conocimiento es el único escudo contra el miedo y la única herramienta para la grandeza.\n\n```aeterna-decision\nBadge: 🏛️ ÉTICA\nTítulo: La Responsabilidad de la Energía\nPregunta: La energía nuclear puede iluminar ciudades enteras o borrarlas del mapa en un parpadeo. Ante el inminente cambio climático, ¿consideras que la humanidad debe abrazar la energía nuclear como un mal menor necesario para salvar el ecosistema global?\nBotón: Sellar Exégesis y Ascender\n```"
      },
      "acciones": []
    }
  ],
  "conclusion": "La física atómica y nuclear no es solo una rama de la ciencia; es el mapa definitivo de nuestra propia arquitectura existencial. Al descifrar el núcleo, no solo hemos encontrado una fuente de energía inagotable, sino que hemos recuperado el manual de instrucciones de cómo se construyó el universo desde su primer segundo. Somos, en el sentido más literal, polvo de estrellas que busca entender el fuego que lo creó."
};

const jsonString = JSON.stringify(data, null, 2);

fs.writeFileSync('src/data/articles/fisica-atomica-y-nuclear.json', jsonString);
