# Plan de Implementación: Tabla DataTables "Buscador y Listado Oficial de Directivas"

**Fecha:** Agosto 2026
**Estado:** Aprobado para ejecución

---

## Alcance

Sustituir el contenido actual de la sección **"1.2 Buscador y Listado Oficial de Directivas"** dentro de la ficha **"1. Normatividad y Directivas"** de [repositorio.html](../repositorio.html) por una tabla **DataTables** alimentada dinámicamente desde [data/normativas_agroideas.json](../data/normativas_agroideas.json).

---

## Datos de origen

`data/normativas_agroideas.json` — array plano de ~30 registros con los campos:

| Campo JSON | Uso en tabla |
|---|---|
| `titulo` | Título (col. 1) |
| `resolucion_aprobatoria` | Resolución (col. 2) |
| `fecha` (texto "13 de julio de 2020") | Fecha Publicación (col. 3, ordenada cronológicamente mediante `data-order`) |
| `descripcion` | Descripción (col. 4, truncada a 160 c. con tooltip) |
| `enlace` | Enlace (col. 5, botón "Ver norma") |

El JSON **no se modifica**.

---

## Requisitos funcionales

1. Paginación inicial de **10 registros/página**, configurable a 15, 20, 30 y 50.
2. Buscador instantáneo multi-columna.
3. Orden por defecto: **fecha descendente**.
4. Reemplazar **completamente** la estructura actual (acordeones anidados generados por `content-loader.js`).

---

## Decisiones de diseño (aprobadas)

1. Orden por defecto: fecha descendente.
2. **Sin** botones de exportación (Copiar/Excel/PDF) en esta tabla — ya están en pestaña 4 (Publicaciones).
3. Descripción truncada a ~160 caracteres con tooltip (`title` attr).
4. Columna Enlace muestra solo icono `external-link`, no la URL cruda.
5. `window.initRepoTable()` (pestaña 4) **no se toca**.

---

## Plan de Implementación

### Paso 1 — Editar `repositorio.html` (sección 1.2)
Reemplazar el contenido del `<div id="lista-oficial-directivas">` por:

```html
<table id="tablaDirectivas" class="display responsive nowrap" style="width:100%">
  <thead>
    <tr>
      <th>Título</th>
      <th>Resolución</th>
      <th>Fecha Publicación</th>
      <th>Descripción</th>
      <th>Enlace</th>
    </tr>
  </thead>
  <tbody></tbody>
</table>
```

### Paso 2 — Nuevo script `js/directivas-table.js`
- `fetch('data/normativas_agroideas.json')`.
- Parsear `fecha` a ISO para orden cronológico correcto (meses en español → número).
- Inicializar `$('#tablaDirectivas').DataTable({...})` con:
  - `pageLength: 10`, `lengthMenu: [10,15,20,30,50]`
  - `order: [[2, 'desc']]` (fecha desc)
  - `dom: 'lfrtip'` (sin botones)
  - `responsive: true`
  - `language` en español con `searchPlaceholder: "Buscar directiva..."`
  - `drawCallback` que re-renderiza iconos Lucide
- Mensaje de carga y de error.

### Paso 3 — Incluir script en `repositorio.html`
Añadir `<script src="js/directivas-table.js"></script>` tras `content-loader.js`.

### Paso 4 — Depurar `content-loader.js`
Eliminar dentro de `loadRepository()` el bloque **"1. Directivas (Accordion)"** que rellenaba `#lista-oficial-directivas`. Resto intacto.

### Paso 5 — Ajustes menores en `css/repositorio.css`
- Hover de fila y consistencia tipográfica.

### Paso 6 — Verificación
Servir con HTTP local (`npx serve` / Live Server), abrir `repositorio.html` → pestaña 1 → acordeón 1.2, comprobar paginación, búsqueda, orden por fecha y enlace.

---

## Archivos afectados

| Archivo | Acción |
|---|---|
| [repositorio.html](../repositorio.html) | Reemplazar contenido de 1.2 + nueva etiqueta `<script>` |
| [js/directivas-table.js](../js/directivas-table.js) | **Nuevo** |
| [js/content-loader.js](../js/content-loader.js) | Eliminar bloque de directivas |
| [css/repositorio.css](../css/repositorio.css) | Ajustes menores de estilo |

---

*Unidad de Planeamiento y Presupuesto (UPP) - AGROIDEAS | Modernización del Estado 2026*
