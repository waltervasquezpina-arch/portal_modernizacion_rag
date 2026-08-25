# Walkthrough - Prototipo de Asistente Virtual / Chatbot Normativo SAMGP al 2030

Hemos completado la implementación del **Asistente Virtual / Chatbot Normativo SAMGP al 2030** para el portal web `portal_modernizacion-main`, bajo los principios y alcances de la **Ley N° 27658 (Ley Marco de Modernización)** y la **Política Nacional de Modernización de la Gestión Pública al 2030**.

---

## Qué se ha construido

### 1. Base de Conocimiento Normativa (`data/chatbot_knowledge.json`)
- Repositorio estructurado en formato JSON con la información fundamental de las 8 carpetas del directorio `MARCO NORMATIVO SAMGP 2026`:
  - **Ley N° 27658** (Finalidad y Valor Público).
  - **Política Nacional al 2030 (DS N° 103-2022-PCM)** (Enfoques transversales y 4 Objetivos Prioritarios).
  - **Reglamento SAMGP (DS N° 123-2018-PCM)** (Rectoría de la SGP-PCM y articulación intersistémica).
  - **Norma Técnica de Gestión por Procesos N° 002-2025-PCM/SGP** (Procesos estratégicos, misionales y de soporte).
  - **Normas Técnicas 2025 de Calidad de Servicios (GCS), Gestión del Conocimiento (RSGP 001-2025) e Innovación Pública (RSGP 007-2025)**.
  - **Estructuración Organizacional del Estado (LOPE, ROF y MOP)**.
- Todas las entradas incluyen un enlace (`pdf_path`) que apunta exactamente a los archivos PDF dentro del repositorio del proyecto.

### 2. Motor Inteligente & RAG Local (`js/chatbot-engine.js`)
- **Almacenamiento en LocalStorage:** Descarga e indexa automáticamente el corpus en `localStorage.samgp_knowledge_base` y gestiona el historial continuo (`samgp_chat_history`).
- **Control Fuera de Alcance (Out of Scope Guardrail):** Si un usuario realiza una pregunta ajena a las materias de modernización pública, el motor responde con una salvaguarda institucional delimitando su alcance legal.
- **Búsqueda Semántica Local (TF-IDF & Keywords):** Puntuación dinámica que empareja preguntas libres con el corpus y devuelve la respuesta formateada junto con tarjetas de cita y botones para **abrir el PDF normativo original**.
- **Conector Opcional en Vivo con IA:** Incluye un panel donde se puede ingresar una clave de Google Gemini para habilitar generación en tiempo real mediante *In-Context Grounding* sobre nuestro corpus JSON.

### 3. Interfaz Conversacional de Alta Fidelidad (`chatbot.html` & `css/chatbot.css`)
- **Lienzo de Chat Glassmorphism:** Burbujas diferenciadas, animaciones suaves, indicador de "Analizando corpus normativo..." (*typing dots*) y scroll fluidos.
- **Filtros Temáticos (Columna Izquierda):** Permite filtrar por las 8 categorías normativas del SAMGP.
- **Chips de Preguntas Rápidas (Quick Prompts):** Botones interactivos sobre el chat para probar el asistente al instante con un solo clic.
- **Dictado por Voz:** Integración nativa con la API de reconocimiento de voz (`webkitSpeechRecognition`) para consultas dictadas desde el micrófono.
- **Modales de Configuración y Exportación:** Herramienta para copiar o descargar toda la conversación en formato `.TXT` sustentada para informes técnicos o administrativos.

### 4. Integración Omnipresente en el Portal (`js/components.js`)
- **Menú Superior (Navbar):** Añadido el enlace **"Asistente IA"** (con ícono azul animado) en la navegación de escritorio y móvil.
- **Widget Flotante Global (FAB):** Se inyecta un botón circular con resplandor en la esquina inferior derecha en todas las páginas (`index.html`, `repositorio.html`, etc.) para acceder al asistente de manera inmediata desde cualquier lugar.

---

## Verificación de Resultados

### Pruebas Realizadas y Escenarios de Validación
1. **Carga e Indexación de LocalStorage:** Al abrir `chatbot.html`, el motor verifica e indexa `data/chatbot_knowledge.json` en `samgp_knowledge_base` sin demoras.
2. **Consultas Normativas Exitosas:**
   - Consulta: *"¿Cuáles son los 4 objetivos prioritarios de la PNMGP al 2030?"* → Devuelve desglose exacto de OP1, OP2, OP3 y OP4 citando el DS N° 103-2022-PCM.
   - Consulta: *"¿Qué es la Gestión por Procesos según la NT N° 002-2025?"* → Devuelve definición, mapa de procesos y tarjeta con botón de descarga para `GxP_3 - NT-N-002-2025-pcm-sgp-f-f.pdf`.
3. **Guardrail Fuera de Alcance:**
   - Consulta: *"¿Cómo cocinar un arroz con pollo?"* → Devuelve aviso institucional indicando que su especialidad es exclusiva de la Ley N° 27658 y el SAMGP.
4. **Navegación Global:**
   - Se verificó que `index.html` y demás páginas muestran el enlace **Asistente IA** en el navbar y el widget flotante en la esquina derecha.

---

## Cómo Probar el Prototipo

1. Abre tu navegador en la carpeta local del proyecto (`portal_modernizacion-main`).
2. Haz clic en **"Asistente IA"** en el menú superior de cualquier página del portal (o haz clic en el botón circular flotante de la esquina inferior derecha).
3. En la página del **Asistente Virtual SAMGP (`chatbot.html`)**, prueba haciendo clic en cualquiera de los **chips de preguntas sugeridas** o escribe una consulta libre en la barra inferior.
4. Explora el botón **"Exportar"** en la esquina superior derecha para descargar el informe de la conversación en texto plano.
