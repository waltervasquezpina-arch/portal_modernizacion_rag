# Portal Web de Modernización de la Gestión Pública - AGROIDEAS

Este proyecto es una plataforma web estática de alto rendimiento desarrollada para difundir, gestionar e informar sobre el **Proceso de Modernización de la Gestión Pública** en el contexto de **AGROIDEAS** (Programa de Compensaciones para la Competitividad - MIDAGRI). La web proporciona un centro de conocimiento centralizado, normatividad, guías metodológicas, un organigrama interactivo y un **Asistente IA (Chatbot)** para optimizar la toma de decisiones y la mejora continua institucional.

---

## 🚀 Características Principales

- **Arquitectura Estática Desacoplada ("Backend-Less"):** Toda la información variable (textos de secciones, videos explicativos, directivas y base de conocimiento del chatbot) se gestiona de manera declarativa a través de archivos JSON localizados en [data/](data/).
- **Diseño Premium y Responsivo:** Construido con **Tailwind CSS** (vía CDN) y variables CSS institucionales (`css/modern-styles.css`), implementando efectos de vanguardia como *Glassmorphism*, sombras de elevación multinivel y modo oscuro/claro contextual.
- **Inyección Centralizada de Componentes:** Uso de Vanilla JavaScript (`js/components.js`) para la inyección automática del **Header Global**, **Footer**, menú móvil y la inicialización centralizada de íconos y animaciones.
- **Asistente IA y Búsqueda Semántica (`chatbot.html`):** Módulo inteligente con motor **RAG local (TF-IDF)** que consulta el archivo `data/chatbot_knowledge.json` mediante `js/chatbot-engine.js`, ofreciendo respuestas inmediatas sobre normatividad, flujos y lineamientos GxP, con un **conector opcional a Google Gemini** para generación en tiempo real.
- **Repositorio Documental Interactivo (`repositorio.html`):** Catálogo centralizado estructurado en **4 Pestañas / Ejes Documentales** con tablas avanzadas **DataTables**. La pestaña **2. Gestión del Conocimiento** cuenta con un diseño jerárquico de **5 sub-acordeones** (Lecciones Aprendidas, Buenas Prácticas, Guías Técnicas 5W+2H, Actas de Entrega de Conocimiento y **5 Micro-Cursos** incluyendo *Uso de herramientas de IA en la AGROIDEAS*), todos validados por el **Equipo Técnico de Mejora Continua (ETMC)**.
- **Contenido Multimedia Integrado:** Secciones audiovisuales con enlaces directos en alta definición (HD 1080p) vinculados a Google Drive y gestionados dinámicamente mediante `js/content-loader.js`.

---

## 📁 Estructura General del Proyecto y Páginas Web

El portal está organizado en páginas núcleo especializadas que cubren los ejes de la modernización e información institucional:

| Archivo HTML | Propósito y Descripción |
| :--- | :--- |
| **[index.html](index.html)** | **Página Principal (Inicio):** Presenta la visión, pilares de transformación GxP, accesos rápidos al repositorio y CTA de bienvenida. |
| **[gestion_procesos.html](gestion_procesos.html)** | **Eje de Gestión por Procesos:** Cadena de valor, mapeo de procesos, roles, operadores y tutorial audiovisual (Sección 5). |
| **[gestion_conocimiento.html](gestion_conocimiento.html)** | **Eje de Gestión del Conocimiento:** Políticas, captura, transferencia y retención del capital intelectual en AGROIDEAS. |
| **[gestion_calidad.html](gestion_calidad.html)** | **Eje de Gestión de la Calidad:** Mejora regulatoria, estándares de servicio ciudadano y simplificación administrativa. |
| **[gestion_innovacion.html](gestion_innovacion.html)** | **Eje de Innovación Pública:** Laboratorios de innovación, pilotos colaborativos y co-creación de soluciones agrarias. |
| **[repositorio.html](repositorio.html)** | **Repositorio Institucional Centralizado:** Dividido en **4 Pestañas Oficiales**: *1. Normatividad y Directivas*, *2. Gestión del Conocimiento* (con sus 5 subsecciones validadas ETMC y 5 Micro-cursos formativos), *3. Innovación Pública* y *4. Publicaciones y Procesos*. |
| **[chatbot.html](chatbot.html)** | **Asistente IA (Chatbot SAMGP):** Interfaz conversacional inteligente alimentada por la base de conocimiento institucional (RAG local + conector Gemini). |
| **[microcurso.html](microcurso.html)** | **Aula Virtual de Micro-Cursos (SPA):** Plantilla dinámica única que carga video, ficha PDF y cuestionario interactivo desde `data/cursos.json`. |
| **[doc_gestion.html](doc_gestion.html)** | **Hub de Documentos de Gestión:** Acceso rápido al MOP, MAPRO, ROF, PEI, POI y lineamientos estratégicos. |
| **[estructura_organica.html](estructura_organica.html)** | **Estructura Orgánica Funcional:** Organigrama interactivo y detalle jerárquico de la Unidad de Planeamiento y Presupuesto (UPP). |
| **[contacto.html](contacto.html)** | **Atención y Contacto:** Formulario de consultas, directorio de coordinadores GxP y soporte técnico. |

> [!NOTE]
> **Estandarización de Ejes de Gestión:** Las páginas de los 4 ejes (`gestion_*.html`) siguen un esquema uniforme de 5 secciones: **1. Definición / Marco Teórico**, **2. Finalidad / Cadena de Valor**, **3. Fases o Actividades**, **4. Roles y Operadores**, y **5. Contenido Multimedia (Video Explicativo)**.

---

## 📚 Documentación Técnica para Desarrolladores y Agentes IA

Para conocer la arquitectura, patrones de diseño y guías de mantenimiento, consulte los manuales oficiales en el directorio [document/](document/):

1. **[Índice y Guía General de la Documentación](document/0_Indice_Documentacion.md)**: Introducción al ecosistema documental GxP.
2. **[Arquitectura Estructural y Tecnológica](document/1_Arquitectura_Estructural.md)**: Estructura real de archivos, árbol de directorios y motor de inyección central (`components.js`).
3. **[Guía de Estilos UI e Identidad Visual](document/2_Guia_de_Estilos_UI.md)**: Paleta de colores institucionales, variables CSS en `modern-styles.css`, tipografía y pautas de UI/UX.
4. **[Manual de Despliegue y Mantenimiento](document/3_Manual_Despliegue_Mantenimiento.md)**: Instrucciones paso a paso para desplegar en servidores locales o producción web/intranet y actualización sin tocar código HTML.
5. **[Arquitectura de Datos e Interacción Dinámica](document/4_Arquitectura_Datos_Interaccion.md)**: Funcionamiento detallado del cargador JSON (`content-loader.js`), Repositorio de 4 pestañas y el motor conversacional (`chatbot-engine.js`).
6. **[Integración con Sistemas Externos y Escalabilidad](document/5_Integracion_Sistemas_Externos.md)**: Proyección futura hacia SharePoint (Intranet), consumo de REST APIs y evolución del Asistente IA.

---

## 🛠️ Stack Tecnológico

- **Estructura Base:** HTML5 semántico, JavaScript Vanilla (ES6+).
- **Estilos y Maquetación:** [Tailwind CSS](https://tailwindcss.com/) (CDN) + CSS3 Variables custom (`css/modern-styles.css`, `css/repositorio.css`, `css/chatbot.css`).
- **Iconografía:** [Lucide Icons](https://lucide.dev/) (Vectoriales dinámicos e intuitivos).
- **Animaciones e Interacción:** [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) y transiciones Tailwind.
- **Tablas Avanzadas:** [DataTables.net](https://datatables.net/) (búsqueda multicampo y botones de exportación).

---

## 💻 Instrucciones Rápidas de Ejecución

1. Clona o descarga el repositorio en tu computadora o servidor local.
2. Asegúrate de contar con conexión a internet para la carga de bibliotecas de diseño e íconos (CDN de Tailwind, Lucide y AOS).
3. Abre el archivo `index.html` en tu navegador web de preferencia (o utiliza la extensión *Live Server* / `npm run dev` en tu editor de código).
4. Para realizar modificaciones sobre los menús superiores o el pie de página de toda la plataforma, edita un único archivo: **[js/components.js](js/components.js)**.
5. Para actualizar textos, videos tutoriales y documentos de la biblioteca, edita los archivos **[data/content.json](data/content.json)**, **[data/chatbot_knowledge.json](data/chatbot_knowledge.json)** o **[data/cursos.json](data/cursos.json)** (micro-cursos).

---

*Unidad de Planeamiento y Presupuesto (UPP) - AGROIDEAS | Modernización del Estado 2026*
