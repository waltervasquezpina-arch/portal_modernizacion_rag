# Línea Gráfica - Portal de Modernización y Repositorio del Conocimiento

Este documento proyecta y define la línea gráfica para el diseño e implementación del **Portal Web de Modernización y Repositorio Central del Conocimiento**, basado en las presentaciones y piezas visuales de la campaña "Impulsa Agroideas" y el "Modelo de Modernización".

## 1. Concepto Visual
El portal debe transmitir **movimiento, activación, energía e identidad institucional**, alineándose con el sector agrario y el propósito público. La estética debe ser moderna, limpia y orientada a facilitar la transferencia de conocimientos y la gestión por procesos.

## 2. Paleta de Colores
Se sugiere una paleta basada en tonos tierra y naturaleza (sector agrario) con contrastes que brinden modernidad y resalten la información clave.

*   **Verde Principal (Oscuro):** Uso en cabeceras (headers), pie de página (footers), fondos de secciones principales y títulos destacados. Transmite solidez institucional.
    *   *Sugerencia HEX:* `#1A5336` o `#14422B`
*   **Verde Activo (Claro/Brillante):** Uso en botones primarios, iconos, flechas, gráficos de progreso y elementos interactivos (hover).
    *   *Sugerencia HEX:* `#53A548` o `#60B246`
*   **Acento (Amarillo/Dorado):** Uso exclusivo para resaltar información crítica, etiquetas (tags), años (ej. "2026") o notificaciones.
    *   *Sugerencia HEX:* `#F1C40F` o `#E5B800`
*   **Colores Neutros:**
    *   **Blanco (`#FFFFFF`):** Para el fondo principal del contenido, tarjetas (cards) y texto sobre fondos oscuros.
    *   **Verde Agua muy claro / Gris Claro:** Para fondos secundarios, separando secciones sin saturar la vista.
    *   *Sugerencia HEX:* `#EAF2ED` o `#F4F6F5`
    *   **Gris Oscuro (`#333333`):** Para el texto de párrafos y lectura prolongada.

## 3. Tipografía
Se recomienda el uso de tipografías Sans-Serif, modernas, altamente legibles en pantallas y compatibles con estándares web.

*   **Títulos y Encabezados (H1, H2, H3):** *Montserrat* o *Poppins* (Bold / ExtraBold). Para dar peso, impacto y un aspecto institucional moderno.
*   **Cuerpo de Texto y Párrafos:** *Roboto* o *Inter* (Regular). Aseguran una lectura cómoda en los documentos, artículos del repositorio y descripciones.
*   **Texto Destacado (Modos de uso, citas):** Uso de cursivas o un peso Medio (Medium) en la fuente del cuerpo.

## 4. Iconografía y Elementos Gráficos
*   **Estilo de Iconos:** Flat design, sólidos o de líneas gruesas, utilizando el *Verde Activo*. Deben ser intuitivos y representar claramente conceptos como: *Conocimiento (libro/foco), Procesos (engranajes/ciclos), Personas (grupo) y Mejora Continua (gráfica ascendente).*
*   **Formas y Fondos:** Incorporar sutiles formas orgánicas (ondas o curvas suaves) en los fondos de sección de color sólido, como se observa en la presentación "Impulsa Agroideas", para romper la rigidez cuadriculada.
*   **Flechas de Progreso:** Elemento recurrente para denotar avance y modernización (ej. flecha en la "l" o "s" del logotipo Impulsa).

## 5. Diseño de Componentes (UI)
*   **Cabecera (Header):** Fondo blanco o Verde Principal. Debe integrar siempre el logo del Ministerio de Desarrollo Agrario y Riego (Perú) a la izquierda, y el logo de AGROIDEAS a la derecha.
*   **Botones (Buttons):** 
    *   *Primario:* Fondo Verde Activo, texto blanco, bordes ligeramente redondeados (border-radius: 6px u 8px).
    *   *Secundario:* Fondo transparente, borde Verde Activo, texto Verde Activo.
*   **Tarjetas (Cards):** Para mostrar los recursos del "Repositorio Central" o "Espacios Seguros". Fondo blanco, borde sutil o sombra ligera, título en Verde Principal y un icono representativo.
*   **Menú de Navegación:** Claro y accesible, dividiendo los pilares: Gestión de Procesos, Gestión del Conocimiento, Innovación, etc.

## 6. Recomendaciones de Implementación CSS
Se sugiere establecer variables CSS globales en el archivo `index.css` o `style.css` del proyecto para mantener la coherencia en todo el portal web:

```css
:root {
  --color-primary: #1A5336;
  --color-secondary: #53A548;
  --color-accent: #F1C40F;
  --color-bg-light: #F4F6F5;
  --color-text-main: #333333;
  --color-text-inverse: #FFFFFF;
  
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

---
*Nota: Este documento es una base para iniciar la etapa de diseño de interfaces (UI) y puede ser ajustado durante la maquetación web según los requerimientos técnicos y de accesibilidad.*
