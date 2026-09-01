# Plan de Implementación: Mejoras en "1.2 Buscador y Listado Oficial de Directivas" (`repositorio.html`)

Este plan detalla las modificaciones y optimizaciones para la tabla de directivas dentro de la pestaña **"1. Normatividad y Directivas"** de la página [`repositorio.html`](file:///e:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20REPOSITORIO%20CENTRAL/portal_modernizacion-main_copia/repositorio.html), cumpliendo con los 4 requerimientos solicitados por el usuario.

---

## 🎯 Objetivos y Requerimientos

1. **Mejorar los títulos de las directivas (`data/normativas_agroideas.json`):**
   - Actualmente muchos registros tienen como título códigos cortados o números de resolución (ej. `"2022-MIDAGRI-PCC"`, `"MIDAGRI-AGROIDEAS"`, `"Resolución Directoral Ejecutiva N.° 070-2024-MIDAGRI-AGROIDEAS"`).
   - Se revisará la descripción y denominación de cada uno de los ~30 registros del JSON para asignarle un título conciso y temático/descriptivo en pocas palabras (ej. `"Contratación de bienes y servicios menores o iguales a 8 UIT"`, `"Administración y control del Fondo de Caja Chica"`, `"Gestión Documental de AGROIDEAS"`, etc.).
2. **Lectura completa de la descripción (eliminar truncado):**
   - En [`js/directivas-table.js`](file:///e:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20REPOSITORIO%20CENTRAL/portal_modernizacion-main_copia/js/directivas-table.js), la columna descripción truncaba a 160 caracteres con `…`.
   - Se modificará el renderer para mostrar la descripción íntegra y legible con un formato tipográfico claro (`text-xs leading-relaxed text-slate-600`), permitiendo salto de línea adecuado.
3. **Incorporar botones de exportación DataTables (Excel, PDF, Copiar, Imprimir):**
   - Habilitar la barra de botones `dom: 'Bflrtip'` o `dom: 'Blfrtip'` en [`js/directivas-table.js`](file:///e:/AGROIDEAS%20GxP%20-%20Gestion%20Conocimiento/DOCUMENTOS%20DE%20GESTI%C3%93N/8.%20PROPUESTA%20DE%20REPOSITORIO%20CENTRAL/portal_modernizacion-main_copia/js/directivas-table.js).
   - Incluir botones: Copiar al portapapeles, Excel, PDF e Imprimir con iconos Lucide y estilos visuales coherentes con la paleta de la entidad.
4. **Revisar y corregir el funcionamiento del Buscador:**
   - DataTables genera el input de búsqueda interactivo. Se verificará que el filtro en tiempo real busque correctamente en todas las columnas (título temático, resolución, descripción y fecha), se optimizará el placeholder y se asegurará que el layout responsivo (`display responsive`) no oculte ni bloquee los controles.

---

## 🛠️ Archivos a Modificar

```
├── data/
│   └── normativas_agroideas.json        <-- [MODIFICAR] Títulos claros y descriptivos por registro
├── js/
│   └── directivas-table.js              <-- [MODIFICAR] Configuración DataTables, botones Bfrtip, render completo de descripción
└── css/
    └── repositorio.css                  <-- [MODIFICAR] Estilos para los botones de exportación y espaciado de celdas
```

---

## 📝 Detalle de Tareas

### Paso 1: Actualización de Datos en `data/normativas_agroideas.json`
- Revisar los 30 registros uno a uno.
- Para cada uno, extraer el tema sustantivo a partir de su descripción o nombre oficial de la directiva (ejemplo: si la descripción dice *“Aprobar la Directiva de Implementación del Sistema Institucional de Archivos...”*, el título será *"Implementación del Sistema Institucional de Archivos"*).
- Conservar intactos el enlace original, la resolución aprobatoria y la fecha.

### Paso 2: Actualización de `js/directivas-table.js`
- **Configuración de `dom`:** Cambiar de `'lfrtip'` a `'<"flex flex-wrap items-center justify-between gap-4 mb-4"Bf><"overflow-x-auto"rt><"flex flex-wrap items-center justify-between gap-4 mt-4"lip>'` o estructura compatible con DataTables Buttons.
- **Configuración de `buttons`:**
  - Copiar (`copy`)
  - Excel (`excel`)
  - PDF (`pdf`)
  - Imprimir (`print`)
- **Render de Descripción:**
  - Eliminar el recorte de 160 caracteres (`slice(0, 160)`).
  - Devolver el texto completo con escapado HTML de seguridad (`escapeHTML(d)`).
- **Ajuste de Columnas Responsivas:**
  - Configurar las clases y anchos de columna (`min-w-[200px]`, `min-w-[300px]`) para que la descripción se lea fluidamente sin apretar las demás columnas.
- **Garantizar Buscador:**
  - El input de búsqueda de DataTables filtra instantáneamente. Asegurar que las columnas tengan `searchable: true` por defecto.

### Paso 3: Estilos en `css/repositorio.css`
- Asegurar que los botones `.dt-button` tengan el diseño moderno institucional (fondos limpios, hover en `--color-primary`, bordes suaves, iconos visibles).
- Asegurar que la descripción completa no rompa el diseño responsive en pantallas de escritorio y móviles.

---

## 🔍 Plan de Verificación

1. **Prueba en Navegador:**
   - Abrir `repositorio.html` en el navegador.
   - Ir a la pestaña **1. Normatividad y Directivas** -> desplegar acordeón **1.2 Buscador y Listado Oficial de Directivas**.
2. **Validación de Títulos:**
   - Comprobar que cada fila muestre un título descriptivo y no códigos truncados o genéricos.
3. **Validación de Lectura de Descripción:**
   - Comprobar que las descripciones largas se lean de principio a fin sin puntos suspensivos forzados.
4. **Validación de Botones de Exportación:**
   - Probar clic en **Excel** (verificar descarga de `.xlsx`).
   - Probar clic en **PDF** (verificar generación de PDF).
   - Probar clic en **Copiar** (verificar copia en portapapeles).
   - Probar clic en **Imprimir** (verificar diálogo de impresión).
5. **Validación del Buscador:**
   - Escribir palabras clave (ej: "caja chica", "viajes", "archivos", "UIT", "8 UIT") en la caja de búsqueda y confirmar que la tabla filtra los resultados en tiempo real al instante.
