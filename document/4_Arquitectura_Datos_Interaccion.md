# Arquitectura de Datos e Interacción Dinámica

## 1. El Paradigma de Datos Desacoplados (Backend-Less)
El portal opera bajo un enfoque modular de **datos declarativos desacoplados**. Toda la información variable y el contenido técnico susceptible a actualizaciones periódicas (textos descriptivos de los ejes de gestión, videos explicativos, directivas legales del repositorio y base de respuestas del chatbot) se almacena independientemente de las plantillas HTML dentro del directorio `/data`.

---

## 2. Estructura de las Bases de Datos JSON (`/data`)

El sistema cuenta con tres archivos maestros en formato JSON:

### A. `data/content.json` (Contenidos Generales y Repositorio)
Estructurado en tres ramas principales que alimentan las secciones informativas del portal:
- **`sections`:** Arreglo de objetos identificados por el slug de cada eje (`"id": "gestion-procesos"`, `"gestion-conocimiento"`, etc.). Contiene los textos de las 5 secciones estándar (*Definición*, *Finalidad*, *Fases*, *Roles*) y los hipervínculos multimedia (`video_url` y `video_title` apuntando a repositorios en la nube como Google Drive).
- **`repository`:** Catálogo general de directivas, manuales y herramientas de la institución categorizados por las **4 Pestañas del Repositorio** (`normatividad`, `conocimiento`, `innovacion`, `publicaciones`).
- **`updates` o `meta`:** Registro de auditoría y metadatos con fecha de última revisión oficial para control documental.

### B. `data/chatbot_knowledge.json` (Corpus Normativo del Asistente IA)
Estructurado modularmente para el consumo veloz por el motor del chatbot:
- **`metadata`:** Título, versión (`2026.6`), fecha de última actualización y total de módulos (9).
- **`categories`:** Lista de las **9 categorías normativas** filtrables en el sidebar (Marco General, Política 2030, Reglamento SAMGP, Gestión por Procesos, Calidad, Conocimiento, Innovación, Organización del Estado e **Instructivos Operativos**).
- **`knowledge_nodes`:** Nodos de conocimiento con `id`, `category`, `title`, `source` (norma legal), `pdf_path` (ruta al PDF real en `MARCO NORMATIVO SAMGP 2026/`), `keywords`, `question_patterns`, `answer` (HTML) y `quick_prompt`.

### C. `data/cursos.json` (Currícula de Micro-Cursos)
Estructurado para alimentar el Aula Virtual SPA:
- **`modulos`:** Arreglo de 5 módulos (`modulo1` a `modulo5`) con `id`, `titulo`, `eje` (A–E), `descripcion` y `subtemas`.
- **`subtemas`:** Cada subtema (`A.1`, `A.2`, etc.) contiene `id`, `titulo`, `descripcion`, `video_url`, `pdf_url` y `preguntas`.
- **`preguntas`:** Cuestionario interactivo con `pregunta`, `opciones` (arreglo) y `respuestaCorrecta` (índice).

---

## 3. Ciclo de Vida del Renderizado y Cargadores (`js/`)

El flujo de procesamiento de contenidos entre el sistema de archivos y el navegador sigue este orden jerárquico:

```mermaid
sequenceDiagram
    participant B as Navegador (DOM HTML)
    participant C as components.js (Global UI)
    participant L as content-loader.js (Ejes & Repositorio)
    participant E as chatbot-engine.js (Asistente IA)
    participant J as content.json / chatbot_knowledge.json

    Note over B: El usuario abre una página (ej. gestion_procesos.html)
    B->>C: Carga y ejecuta inyección global
    C->>B: Renderiza <header>, <footer>, íconos Lucide y AOS
    B->>L: Invoca inicialización de carga de contenidos
    L->>J: fetch('data/content.json')
    J-->>L: Devuelve estructura de secciones y videos
    L->>B: Inyecta textos en #definition, #purpose, #phases, #roles
    L->>B: Vincula a.block.relative.aspect-video con video_url (Google Drive HD)
    Note over B,E: Si la página activa es chatbot.html o se abre el widget IA:
    B->>E: Inicializa motor semántico local
    E->>J: fetch('data/chatbot_knowledge.json')
    J-->>E: Devuelve base léxica y respuestas pre-configuradas
```

---

## 4. Motor de Carga Dinámica (`js/content-loader.js`)

El archivo **`content-loader.js`** es el encargado de enlazar la interfaz estática con los datos en formato JSON:
1. **Identificación de Página:** Lee el atributo semántico `data-page-id` en el `<body>` de la página actual (`gestion-procesos`, `gestion-conocimiento`, etc.).
2. **Inyección en Secciones Estandarizadas:** Rellena los contenedores de texto sin requerir que el administrador modifique la estructura HTML.
3. **Vinculación Dinámica de Video Explicativo:** Si detecta la propiedad `"video_url"` y es diferente de `"#"` o vacía, actualiza la propiedad `href` del contenedor multimedia (`#multimedia a`) y establece `target="_blank"` para asegurar que la reproducción del video de Google Drive ocurra fluidamente en una pestaña independiente.
4. **Alimentación del Repositorio (`repositorio.html`):** Si la página activa es el Repositorio, procesa la colección `"repository"`, clasifica los documentos según su categoría en las **4 pestañas activas** e inyecta las filas en las tablas correspondientes antes de disparar la inicialización de **DataTables**.

---

## 5. Arquitectura del Asistente IA (`js/chatbot-engine.js`)

El Asistente IA del portal opera bajo una arquitectura **RAG local (Retrieval-Augmented Generation)** con búsqueda semántica TF-IDF, sin latencia de red de servidores remotos, y con un **conector opcional a Google Gemini**:

```mermaid
graph TD
    A[Entrada del Usuario / Input Texto o Voz] --> B[Normalización de String y Tokenización]
    B --> C[Búsqueda Semántica TF-IDF + Keywords]
    C --> D{¿Coincidencia con knowledge_nodes en chatbot_knowledge.json?}
    D -- Sí (Score >= umbral) --> E[Selección de Respuesta en Base SAMGP]
    D -- No (Ambiguo / Out of Scope) --> F[Respuesta de Fallback + Guardrail + Sugerencias Rápidas]
    E --> G[Renderizado de Burbuja HTML + Píldoras de Enlace + Botón PDF]
    F --> G
    G --> H[Actualización del Historial en LocalStorage y Scroll del Panel]
    E -. Conector Gemini activo .-> I[Generación en vivo con In-Context Grounding]
    I --> G
```

- **Cero Dependencia de Servidores Remotos (modo por defecto):** Al procesar la búsqueda léxica y semántica del lado del cliente (`client-side`) sobre `chatbot_knowledge.json`, el asistente responde en milisegundos y funciona sin problemas incluso bajo firewalls restrictivos de oficinas gubernamentales.
- **Persistencia en LocalStorage:** El corpus se indexa en `samgp_knowledge_base`, el historial en `samgp_chat_history` y los ajustes (incluida la API Key de Gemini) en `samgp_chatbot_settings`.
- **Guardrail Fuera de Alcance (Out of Scope):** Si la consulta es ajena al SAMGP o el puntaje de similitud es insuficiente, el motor responde con una salvaguarda institucional delimitando su alcance legal.
- **Dictado por Voz:** Integración nativa con `webkitSpeechRecognition` para consultas dictadas desde el micrófono.

---

## 6. Interfaz y Flujo de las Tablas DataTables (`repositorio.html`)

- **Estructura en 4 Pestañas (`normatividad`, `conocimiento`, `innovacion`, `publicaciones`):** Cada pestaña cuenta con su propia organización documental. Específicamente, **`conocimiento`** despliega una jerarquía de **5 sub-acordeones** con tablas estandarizadas de registros validados por el **ETMC** (Lecciones Aprendidas, Buenas Prácticas, Guías Técnicas 5W+2H, Actas Offboarding) y una cuadrícula responsiva de **5 Micro-Cursos** de autoaprendizaje (incluyendo Inteligencia Artificial).
- **Búsqueda Instantánea Multi-columna:** El buscador de DataTables filtra en milisegundos por título de directiva, año, código o descripción.
- **Botones de Exportación (`pdfMake`, `JSZip`):** Integración nativa de botones para exportar el listado oficial a **Excel (.xlsx)**, **PDF corporativo** o mandar directo a **Impresión (`print`)** con formato optimizado.

---

## 7. Flujo SPA de los Micro-Cursos (`microcurso.js` + `microcurso-modal.js`)

El módulo de Micro-Cursos implementa una arquitectura **SPA (Single Page Application)** con dos puntos de entrada:

```mermaid
sequenceDiagram
    participant R as repositorio.html
    participant M as microcurso-modal.js
    participant C as cursos.json
    participant A as microcurso.html
    participant J as microcurso.js

    R->>M: Clic en tarjeta de Módulo (1-5)
    M->>C: fetch('data/cursos.json')
    C-->>M: Devuelve módulo y subtemas
    M->>R: Abre Modal "Índice de Módulo" con subtemas
    R->>A: Clic "Iniciar" -> microcurso.html?modulo=X&subtema=Y
    A->>J: Lee parámetros de URL (modulo, subtema)
    J->>C: fetch('data/cursos.json')
    C-->>J: Devuelve subtema (título, video, PDF, preguntas)
    J->>A: Renderiza video, ficha PDF y cuestionario
    J->>A: Actualiza barra de progreso al responder
```

- **`microcurso-modal.js`:** Carga la data en el modal de la pantalla principal y gestiona la apertura/cierre con transiciones (`opacity-0`, `scale-95`). También soporta el parámetro `?openModal=moduloX` para deep-linking directo.
- **`microcurso.js`:** Lee los parámetros de URL, inyecta los datos del subtema y procesa la interactividad del cuestionario (validación de radios, barra de progreso y habilitación del botón "Finalizar").
