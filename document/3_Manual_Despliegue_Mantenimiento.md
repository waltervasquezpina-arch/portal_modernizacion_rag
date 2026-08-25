# Manual de Despliegue y Mantenimiento - Portal Web AGROIDEAS

## Requisitos de Ejecución y Filosofía Arquitectónica
El Portal Web de Modernización de la Gestión Pública de AGROIDEAS es una plataforma **Estática de Alta Disponibilidad (Serverless Ready & Backend-Less)**. Ha sido diseñada expresamente para no requerir motores de bases de datos relacionales (MySQL, PostgreSQL, Oracle) ni servidores de lenguajes de backend tradicionales (PHP, Java/Tomcat, Python, ASP.NET) para su funcionamiento principal.

### Dependencias Externas (Inyectadas vía CDN en el `<head>` o al final del `<body>`):
- **Tailwind CSS (`https://cdn.tailwindcss.com`):** Para estilización rápida y diseño responsivo.
- **Lucide Icons (`https://unpkg.com/lucide@latest`):** Para iconografía vectorial institucional.
- **AOS Library (`https://unpkg.com/aos@2.3.1/dist/...`):** Para animaciones de aparición al hacer scroll.
- **jQuery & DataTables (`https://cdn.datatables.net/...`):** Para tablas interactivas con filtrado, ordenamiento y exportación de documentos en el repositorio.

---

## 1. Despliegue en Entorno de Desarrollo (Local o Pruebas)

Para previsualizar el sitio web en una computadora de trabajo, realizar modificaciones estéticas o auditar el contenido:

1. **Clonado del Repositorio:** Clona el código fuente desde el repositorio institucional Git (o extrae el archivo `.zip` con el directorio raíz `portal_modernizacion-main`).
2. **Conectividad a Internet:** Asegúrate de tener conexión activa a internet, ya que las bibliotecas de diseño e íconos se cargan en tiempo real desde los CDNs oficiales.
3. **Ejecución Local:** 
   - Puedes hacer doble clic en el archivo **`index.html`** para abrirlo directamente en el navegador (Chrome, Edge o Firefox).
   - *Recomendado para desarrolladores:* Utiliza la extensión **Live Server** de Visual Studio Code o el servidor integrado de Python (`python -m http.server 8000`) para simular peticiones HTTP reales y evitar bloqueos por protocolos locales de seguridad CORS (`file://`).
4. **Cero Compilación:** El portal no requiere ejecutar comandos de compilación como `npm install`, `npm run build` o `webpack`. El código fuente en HTML, JS y CSS es el mismo que se despliega en producción.

---

## 2. Despliegue en Servidores de Producción (Web / Intranet)

Debido a su diseño modular estático, el portal puede publicarse de forma inmediata sobre cualquier servidor web moderno o portal corporativo existente:

### A. Hosting Tradicional o Servidores Institucionales (Apache / Nginx / IIS)
- **Apache / cPanel / Plesk:** Copia el contenido completo de la carpeta raíz (`index.html`, `gestion_*.html`, `repositorio.html`, `chatbot.html`, carpetas `/css`, `/js`, `/data`, `/images`) directamente en el directorio público (`public_html` o `www`).
- **Microsoft IIS (Windows Server On-Premise):** Crea un nuevo sitio web en el Administrador de IIS apuntando al directorio físico del proyecto. Asegúrate de verificar en los Tipos MIME (*MIME Types*) que la extensión `.json` esté configurada como `application/json` para permitir la lectura correcta de `/data/content.json` y `/data/chatbot_knowledge.json`.
- **Nginx:** Define el `root` del server block apuntando a la carpeta del proyecto e incluye el manejo de índices (`index index.html;`).

### B. Plataformas Cloud Modernas (GitHub Pages / Vercel / Netlify / Azure Static Web Apps)
- Sube o conecta la rama `main` del repositorio de Git. La plataforma detectará el `index.html` automáticamente y publicará el portal en segundos sobre una red de distribución global (CDN) con certificados SSL/HTTPS automáticos.

---

## 3. Protocolos Oficiales de Mantenimiento y Actualización de Contenido

> [!IMPORTANT]
> **Regla de Oro del Mantenimiento:** Los archivos HTML (`*.html`) se consideran **plantillas estructurales**. Para modificar textos, videos explicativos, directivas de tabla o la lógica del menú, **NO edites manualmente cada página HTML por separado**. Utiliza los puntos centralizados que se detallan a continuación.

### A. Modificación de la Navegación Global y Créditos (`js/components.js`)
Si la Unidad de Planeamiento y Presupuesto (UPP) requiere añadir un nuevo enlace al menú superior, renombrar un eje estratégico o actualizar el número de contacto en el pie de página:

1. Abre el archivo **`js/components.js`** en tu editor de código.
2. Para cambiar el encabezado o menú superior, modifica la cadena HTML o la lista de hipervínculos dentro de la constante o método `components.header`.
3. Para cambiar los créditos institucionales o enlaces rápidos del pie de página, modifica el bloque `components.footer`.
4. Al guardar el archivo en el servidor, el cambio se replicará al instante y de manera homogénea en absolutamente todas las páginas (`index.html`, los 4 ejes, `repositorio.html`, `chatbot.html`, `microcurso.html`, `doc_gestion.html`, `estructura_organica.html` y `contacto.html`).

### B. Actualización de Secciones y Videos Tutoriales (`data/content.json`)
Para cambiar el texto de un eje de gestión, agregar un paso en una fase, o reemplazar la URL del video tutorial de un eje:

1. Abre el archivo de base de datos declarativa **`data/content.json`**.
2. Localiza el objeto correspondiente dentro del arreglo de secciones (`"id": "gestion-procesos"`, `"gestion-conocimiento"`, etc.).
3. Para modificar el enlace del video de Google Drive en el Eje de Gestión por Procesos (Sección 5), ubica las claves:
   ```json
   "video_url": "https://drive.google.com/file/d/1nGhc-Aos3I6JXX2WGfRUqsDQZAe6v-k_/view?usp=sharing",
   "video_title": "Tutorial: Gestión por Procesos"
   ```
4. Reemplaza el enlace `"video_url"` por el nuevo link compartible de Google Drive. Al cargar la página, el script central (`js/content-loader.js`) actualizará automáticamente el atributo `href` y abrirá el video en una nueva pestaña (`target="_blank"`).

### C. Gestión del Repositorio Institucional (`repositorio.html`)
La página del repositorio cuenta con **4 Pestañas / Ejes Documentales**:
1. `normatividad` (Normatividad y Directivas)
2. `conocimiento` (Gestión del Conocimiento)
3. `innovacion` (Innovación Pública)
4. `publicaciones` (Publicaciones y Procesos)

Para agregar un nuevo documento legal o guía a estas tablas sin tocar código HTML ni reconfigurar DataTables:
- Edita el bloque `"repository"` en **`data/content.json`** y agrega un nuevo objeto con los campos: `"title"` (Nombre del documento), `"code"` (Código normativo / Año), `"category"` (Pestaña a la que pertenece: `normatividad`, `conocimiento`, etc.), `"date"` y `"file_url"`. El script `content-loader.js` creará la fila en la tabla de forma automática.

### D. Actualización de la Base de Conocimiento del Asistente IA (`data/chatbot_knowledge.json`)
El Chatbot SAMGP (`chatbot.html`) no requiere reprogramar código complejo de inteligencia artificial cuando cambia una norma o lineamiento GxP:

1. Abre el archivo especializado **`data/chatbot_knowledge.json`**.
2. Agrega o actualiza las entradas de conocimiento (`knowledge_nodes`, `keywords`, `question_patterns` o banco de preguntas y respuestas institucionales), organizadas en **9 categorías normativas** (incluyendo *8. Instructivos Operativos*).
3. El motor de procesamiento local (`js/chatbot-engine.js`) leerá las nuevas definiciones inmediatamente para responder con precisión las consultas del usuario en la interfaz del asistente.
4. **Conector Gemini (opcional):** Para habilitar generación en tiempo real, el usuario puede ingresar una API Key de Google Gemini desde el panel de configuración del chatbot; esta se almacena en `LocalStorage` y activa el modo *In-Context Grounding* sobre el corpus JSON.

### E. Actualización de los Micro-Cursos (`data/cursos.json`)
El Aula Virtual (`microcurso.html`) es una plantilla SPA única; **no se crean páginas HTML por curso**:

1. Abre el archivo **`data/cursos.json`**.
2. Localiza el módulo (`modulos`) y el subtema (`subtemas`) a modificar.
3. Actualiza los campos `titulo`, `descripcion`, `video_url`, `pdf_url` o el arreglo `preguntas` (con `opciones` y `respuestaCorrecta`).
4. Al guardar, `js/microcurso.js` y `js/microcurso-modal.js` reflejarán los cambios automáticamente en el modal del repositorio y en el Aula Virtual.

---

## 4. Solución de Problemas Frecuentes (Troubleshooting)

- **El menú o el footer no aparecen al abrir los archivos localmente en Chrome:**  
  *Causa:* Las políticas de seguridad del navegador bloquean peticiones AJAX o carga de módulos cuando el archivo se abre directamente con el protocolo `file://`.  
  *Solución:* Abre el portal utilizando un servidor local (extensión Live Server o `python -m http.server`) o súbelo al servidor web institucional.
- **El archivo `content.json` no carga en un servidor Windows IIS:**  
  *Causa:* Falta de registro del tipo MIME en IIS.  
  *Solución:* En el Administrador de IIS, ingresa a "Tipos MIME" (*MIME Types*) y añade la extensión `.json` con el tipo `application/json`.
- **La tabla del repositorio o las animaciones van lentas en computadoras de escritorio antiguas:**  
  *Solución:* Verifica que la propiedad `once: true` de AOS en `components.js` esté habilitada, y asegúrate de que el cargador de DataTables pague los registros (`pageLength: 10` o `25`) para no sobrecargar el renderizado del DOM de una sola vez.

---

*Unidad de Planeamiento y Presupuesto (UPP) - AGROIDEAS | Modernización del Estado 2026*
