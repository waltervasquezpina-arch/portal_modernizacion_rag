# Integración con Sistemas Externos y Escalabilidad Corporativa

## 1. Integración con la Intranet Institucional (SharePoint / Microsoft 365)
El "Portal Web de Gestión y Modernización de AGROIDEAS" ha sido estructurado como una solución frontend ligera, altamente modular y ágil, pensada para poder conviver de forma independiente o ser incrustada directamente en el ecosistema digital corporativo de la institución (SharePoint Online / Intranet GxP).

### Escenarios Técnicos de Convivencia e Interoperabilidad:
- **Incrustación vía IFrame / Web Part SPFx:** Las páginas principales, el Hub de Documentos de Gestión (`doc_gestion.html`), la Estructura Orgánica (`estructura_organica.html`) o el propio Repositorio (`repositorio.html`) pueden ser incrustados dentro de páginas de SharePoint utilizando un componente *Page Viewer* o un *Web Part* personalizado desarrollado en **SharePoint Framework (SPFx)**. Su maquetación responsiva con Tailwind CSS se adapta automáticamente al ancho del contenedor en SharePoint sin cortar tablas ni deformar tarjetas.
- **Redirección y Validación Single Sign-On (SSO):** Al estar bajo el dominio corporativo (`@agroideas.gob.pe`), la futura capa de autenticación para accesos restringidos o consultas internas puede integrarse de forma nativa con **Azure Active Directory (Entra ID)** o la **Microsoft Graph API**. Esto permite heredar la sesión activa de Windows/Office 365 del usuario del MIDAGRI sin requerir credenciales adicionales ni pantallas de login invasivas.

---

## 2. Proyección Backend y REST APIs para el Repositorio

Actualmente, el sistema consume archivos JSON estáticos en `/data` (`content.json` y `chatbot_knowledge.json`) leídos a través del navegador. Gracias al diseño desacoplado del motor (`js/content-loader.js`), la migración futura hacia un backend real (ej. Node.js, Python/FastAPI, .NET Core o conectores de SharePoint Lists) requiere cambios mínimos de infraestructura:

1. **Sustitución de Endpoints REST:** Basta con reemplazar la ruta relativa `fetch('data/content.json')` dentro de `content-loader.js` por una llamada `fetch()` dirigida al endpoint REST institucional definitivo (por ejemplo: `https://api.agroideas.gob.pe/v1/repositorio`).
2. **Configuración de Encabezados CORS:** El servidor de backend que sirva los documentos o directivas deberá habilitar las políticas CORS (*Cross-Origin Resource Sharing*) autorizando peticiones provenientes del dominio donde se aloje el frontend estático.
3. **Paginación del Lado del Servidor (`serverSide: true`):** Las 4 pestañas del Repositorio (`normatividad`, `conocimiento`, `innovacion`, `publicaciones`) utilizan DataTables. Cuando el volumen de documentos supere los 5,000 registros históricos, se recomienda activar en la inicialización del script la opción `serverSide: true` de DataTables, delegando el filtrado, ordenamiento y paginación directamente al motor de base de datos en el servidor, garantizando que el navegador del usuario final continúe cargando en menos de 1 segundo.

---

## 3. Evolución y Escalabilidad del Asistente IA (`chatbot.html`)

El actual Asistente IA (Chatbot SAMGP) funciona con un motor **RAG local (TF-IDF)** sobre `data/chatbot_knowledge.json`, y ya incorpora un **conector opcional a Google Gemini** que el usuario puede activar ingresando una API Key desde el panel de configuración (almacenada en `LocalStorage`). Para escalar este módulo hacia inteligencia artificial generativa pura (LLM) a nivel institucional:

- **Arquitectura RAG (*Retrieval-Augmented Generation*):** El archivo `chatbot_knowledge.json` y los anexos normativos de las 4 pestañas del Repositorio pueden ser indexados en una base de datos vectorial (ej. *Pinecone*, *ChromaDB* o *Azure AI Search*).
- **Conexión a LLMs Cloud (Azure OpenAI / Google Gemini API):** Se puede sustituir la función de procesamiento local en `chatbot-engine.js` por una petición asíncrona hacia un microservicio backend (Python/LangChain) que conecte con modelos como **GPT-4o** o **Gemini Pro**. El microservicio consultará la base documental de AGROIDEAS y retornará respuestas citando la directiva legal exacta con el hipervínculo correspondiente al Repositorio o Google Drive.
- **Ecosistema ESV / SIPA (Espacios Seguros Virtuales):** El portal comparte visión con la plataforma ESV (ciclo SIPA dual GC/GIP), que ya integra **Google Gemini 1.5 Flash** como motor de mentoría con lógica de *Veto DI NO* y un editor BPMN 2.0 en el navegador. Esta arquitectura *Zero-Setup* (Vanilla JS + Tailwind + LocalStorage) es un referente de escalabilidad para futuras integraciones del Asistente IA con flujos de prototipado agéntico.

---

## 4. Analítica Web, Monitoreo y Auditoría de Uso

Para medir el impacto de la modernización institucional y optimizar continuamente la plataforma:

- **Etiquetado Analytics (Google Analytics 4 / Microsoft Clarity):** Se recomienda incrustar los scripts de seguimiento corporativo en el `<head>` de `index.html` y dentro de `components.js` para registrar métricas clave:
  - Términos de búsqueda más frecuentes en las 4 pestañas del Repositorio.
  - Tasa de reproducción y tiempo de visualización del Video Explicativo en las páginas de ejes (`gestion_*.html`).
  - Consultas e *intents* más populares solicitados al Asistente IA (`chatbot.html`).
- **Monitoreo de Errores Frontend (Sentry):** Integrar una herramienta de monitoreo y reporte de excepciones JavaScript para detectar posibles caídas de red local, errores de carga de CDNs o bloqueos CORS en las computadoras de los coordinadores GxP dentro de la red corporativa del Estado.

---

*Unidad de Planeamiento y Presupuesto (UPP) - AGROIDEAS | Modernización del Estado 2026*
