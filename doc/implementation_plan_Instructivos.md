# Evaluación de la Incorporación de "Instructivos" en la Interfaz (chatbot.html)

## Análisis y Evaluación

Actualmente, el archivo `chatbot_knowledge.json` cuenta con una nueva categoría interna (`instructivos_agroideas`), pero los botones de filtrado en el panel izquierdo (sidebar) de `chatbot.html` están construidos de manera estática (hardcoded). Por ello, el nuevo filtro no es visible para el usuario.

Al evaluar si los Instructivos deben ser un módulo independiente o integrarse a los existentes, tenemos dos perspectivas:

1. **Perspectiva Técnica (Normativa):** Los instructivos (Asociatividad, Gestión Empresarial, EEMRI, etc.) son documentos operativos que estandarizan el "Core Business" de AGROIDEAS. Según la Norma Técnica de Gestión por Procesos (NT N° 002-2025-PCM/SGP), estos representan **Procesos Operativos o Misionales**. Por tanto, teóricamente su conocimiento pertenece al módulo **"3. Gestión por Procesos (GxP)"**.
2. **Perspectiva de Experiencia de Usuario (UX):** Para un ciudadano o servidor público que ingresa al chatbot, buscar un "Instructivo de Asociatividad" dentro de la categoría abstracta de "Gestión por Procesos" no es intuitivo. Dado que los instructivos son la consulta más frecuente por ser el paso a paso para acceder a incentivos, merecen un acceso directo.

**Conclusión:** Corresponde identificarlo como un **nuevo módulo independiente** en la interfaz para garantizar la mejor usabilidad, etiquetado como "8. Instructivos Operativos", tal cual se configuró en la base de datos JSON en el paso anterior.

## Proposed Changes

### Interfaz del Chatbot

#### [MODIFY] [chatbot.html](file:///d:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20REPOSITORIO%20CENTRAL/portal_modernizacion-main/chatbot.html)
- Se agregará un nuevo botón `<button data-cat="instructivos_agroideas">` en el menú lateral (sidebar), justo debajo de "7. Organización Estado".
- Se utilizará el ícono `file-text` (de la librería Lucide, que ya usa el proyecto).
- Se mantendrá el estilo visual (`cat-btn`, clases de Tailwind) idéntico a los demás botones para asegurar coherencia en el diseño.

## User Review Required

> [!IMPORTANT]  
> ¿Estás de acuerdo con mantener los "Instructivos Operativos" como un **botón/módulo independiente** en el menú lateral para facilitar su acceso, en lugar de ocultarlos dentro de "Gestión por Procesos"? Si apruebas, procederé con la inserción del código HTML correspondiente.

## Verification Plan

### 1. Manual Verification (Interfaz)
- Cargar `chatbot.html` en el navegador.
- Verificar que el botón "8. Instructivos Operativos" aparezca en el menú lateral.

### 2. Pruebas de Precisión Normativa y RAG Local (Módulo Instructivos)
Una vez implementado el botón en la interfaz, se ejecutarán las siguientes pruebas seleccionando el nuevo filtro "8. Instructivos Operativos":

#### Casos de Prueba Funcionales (Precisión Positiva)
- **Prueba 13 (Instructivos Operativos - Asociatividad):** Preguntar *"¿Cuáles son los requisitos para la asociatividad en AGROIDEAS?"*. Verificar respuesta detallando disposiciones y procedimientos con enlace a `INSTRUCTIVO_ASOCIATIVIDAD.pdf`.
- **Prueba 14 (Instructivos Operativos - EEMRI):** Preguntar *"¿Cómo apoya el programa a las mujeres rurales e indígenas y qué es EEMRI?"*. Verificar respuesta sobre subvenciones a OAM e impulso de autonomía citando el Instructivo EEMRI.
- **Prueba 15 (Instructivos Operativos - Tecnología):** Preguntar *"¿De qué trata el Instructivo de Adopción de Tecnología?"*. Verificar explicación sobre el cofinanciamiento PNT y enlace al instructivo aprobado en RDE 260-2023.
- **Prueba 16 (Instructivos Operativos - Gestión Empresarial):** Preguntar *"¿Cómo funciona el incentivo de Gestión Empresarial?"*. Verificar que explique la RDE 114-2026 y el financiamiento de gerentes.
- **Prueba 17 (Instructivos Operativos - Formas Asociativas):** Preguntar *"¿Qué es el Instructivo de Formas Asociativas?"*. Verificar que se mencione el fortalecimiento técnico y legal de cooperativas.

#### Casos de Prueba de Negación y Manejo de Errores (Resiliencia)
- **Prueba 18 (Negación / Bloqueo de Categoría Incongruente):** Teniendo activo el filtro *"8. Instructivos Operativos"*, preguntar *"¿Cuáles son los 4 objetivos de la Política 2030?"*. Verificar que el motor arroje puntuación insuficiente para el filtro actual y sugiera cambiar la categoría a "Todos los Temas".
- **Prueba 19 (Negación / Fuera de Alcance Institucional):** Estando en la pestaña de Instructivos, preguntar *"¿Cómo sacar mi pasaporte?"*. Verificar que lance la tarjeta de error **Out of Scope** precisando que solo responde temas del SAMGP y de los Instructivos de AGROIDEAS.
- **Prueba 20 (Manejo de Errores / Input Vacío o Ininteligible):** Enviar caracteres sin sentido *"asdasdasd"* o solo signos de puntuación. Verificar que el bot de forma cortés indique que no comprende la consulta y sugiera usar una de las preguntas sugeridas.
