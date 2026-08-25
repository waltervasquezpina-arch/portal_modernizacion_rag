# Plan de Implementación de la Nueva Línea Gráfica

Este documento detalla el plan para adecuar el diseño y la línea gráfica del Portal de Modernización y Repositorio del Conocimiento, basado en las directrices establecidas en el documento `lineaGrafica.md` (identidad "Impulsa Agroideas").

## 1. Objetivo General
Migrar la identidad visual actual (que usa colores genéricos como rojo PCM, azul y verdes estándar) hacia la nueva identidad institucional de **Modernización 2026** (Verde Principal, Verde Activo y Acento Amarillo), integrando fuentes tipográficas modernas e iconografía flat.

> [!IMPORTANT]  
> **Revisión del Usuario Requerida**  
> Antes de proceder, necesito que apruebes este plan. Esto implicará modificar de forma masiva los colores y estilos en todos los archivos HTML y CSS del proyecto.

## 2. Cambios Propuestos

### Configuración Global (CSS y Tailwind)
- **`css/modern-styles.css`**: 
  - Actualizar el bloque `:root` con las nuevas variables CSS descritas en `lineaGrafica.md`.
  - Reemplazar las clases antiguas (`.bg-agro-blue`, `.bg-pcm-red`, etc.) por nuevas clases utilitarias o eliminarlas en favor de la configuración extendida de Tailwind.
  - Añadir la importación de la fuente **Montserrat** (para títulos).
- **Inyección de Configuración de Tailwind**: 
  - Añadir un `<script>` en el `<head>` de todos los archivos HTML para extender el tema por defecto de Tailwind, definiendo los colores `primary` (#1A5336), `secondary` (#53A548), `accent` (#F1C40F) y `bglight` (#F4F6F5), así como las fuentes `sans` (Inter) y `heading` (Montserrat).

### Actualización de Archivos HTML
Se deben actualizar las clases de Tailwind en todos los archivos HTML para reflejar la nueva paleta. Esto incluye modificar:
- Gradientes de hero sections (remover rojos/ámbar, usar tonos verdes).
- Colores de botones (cambiar `bg-pcm-red` a `bg-secondary` o `bg-primary`).
- Colores de textos destacados (usar `text-primary` en títulos y `text-accent` en resaltados).
- Iconos (cambiar los colores de los contenedores de iconos de azules/púrpuras/rojos a variaciones de verde y amarillo).

#### Archivos a intervenir:
- [MODIFY] `index.html`
- [MODIFY] `repositorio.html`
- [MODIFY] `gestion_conocimiento.html`
- [MODIFY] `gestion_procesos.html`
- [MODIFY] `gestion_calidad.html`
- [MODIFY] `gestion_innovacion.html`
- [MODIFY] `estructura_organica.html`
- [MODIFY] `doc_gestion.html`
- [MODIFY] `contacto.html`
- [MODIFY] `chatbot.html`

### Archivos CSS Específicos
- [MODIFY] `css/modern-styles.css`
- [MODIFY] `css/repositorio.css` (Si utiliza variables de colores antiguos).
- [MODIFY] `css/chatbot.css` (Si utiliza variables de colores antiguos).

## 3. Plan de Verificación

### Verificación Manual
- Navegar a `index.html` localmente para confirmar que la hero section, los botones y los íconos utilizan la nueva paleta (Verde Oscuro y Verde Activo).
- Verificar que las fuentes (Montserrat para encabezados e Inter para el cuerpo) se carguen correctamente.
- Revisar las subpáginas (ej. `repositorio.html`, `gestion_procesos.html`) para garantizar consistencia visual en todo el portal.
- Comprobar que no queden rastros del color "rojo PCM" o "azul" en elementos visuales clave.

> [!TIP]
> **Lista de Tareas**
> Una vez aprobado este plan, se creará el documento `task.md` para seguir el progreso de actualización archivo por archivo.
