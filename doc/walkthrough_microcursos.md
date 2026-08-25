# 🚀 Implementación del Módulo 2.5: Micro-Cursos (SPA)

Se ha completado la implementación de la **Opción 4 (Plantilla Dinámica SPA + Modal)** propuesta. A continuación, te presento el resumen de los cambios:

## 1. El Modal "Índice de Módulo" en el Repositorio

Se modificó [repositorio.html](file:///f:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20REPOSITORIO%20CENTRAL/portal_modernizacion-main/repositorio.html) para que las 5 tarjetas (Módulo 1 al 5) abran un Modal Rápido. Este modal carga dinámicamente los subtemas y mantiene al usuario contextualizado sin salir del repositorio principal.

> [!TIP]
> **Pruébalo:** Abre tu `repositorio.html` y haz clic en cualquiera de los Módulos 1 al 5 para ver la animación del modal en acción.

## 2. El "Aula Virtual" (`microcurso.html`)

Se construyó un nuevo archivo [microcurso.html](file:///f:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20REPOSITORIO%20CENTRAL/portal_modernizacion-main/microcurso.html) libre de distracciones. Este entorno integra:
*   Visualizador de video principal (Preparado para iframes de YouTube o Google Vids).
*   Sección de descarga de Fichas en PDF.
*   Panel lateral derecho con un **Check de Aprendizaje (Quiz interactivo)** que valida si el usuario marca todas las opciones.
*   Una barra de progreso interactiva que avanza conforme el usuario responde.

## 3. Base de Datos Centralizada (`cursos.json`)

Se ha estructurado la currícula basada en los "Ejes A-E" del Documento Técnico en [data/cursos.json](file:///f:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20REPOSITORIO%20CENTRAL/portal_modernizacion-main/data/cursos.json).

```json
{
  "id": "A.1",
  "titulo": "Conceptos Fundamentales y el Ciclo de la Gestión por Procesos",
  "preguntas": [
    {
      "pregunta": "¿Cuál es la norma técnica que rige la Gestión por Procesos?",
      "opciones": ["NT N° 001-2025-PCM", "NT N° 002-2025-PCM/SGP", "NT N° 003-2025-PCM"],
      "respuestaCorrecta": 1
    }
  ]
}
```
*Si necesitas añadir o modificar una pregunta, video o subtema, solo debes editar este archivo JSON; la web se actualizará automáticamente.*

## 4. Lógica JavaScript (`microcurso.js` y `microcurso-modal.js`)

Se crearon dos archivos JavaScript modulares:
*   [js/microcurso-modal.js](file:///f:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20REPOSITORIO%20CENTRAL/portal_modernizacion-main/js/microcurso-modal.js): Carga la data en el modal de la pantalla principal.
*   [js/microcurso.js](file:///f:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20REPOSITORIO%20CENTRAL/portal_modernizacion-main/js/microcurso.js): Lee los parámetros de la URL (Ej: `microcurso.html?modulo=modulo1&subtema=A.1`), inyecta los datos correctos y procesa la interactividad del cuestionario y la barra de progreso.
