/**
 * directivas-table.js
 * Carga data/normativas_agroideas.json e inicializa DataTables
 * en la sección "1.2 Buscador y Listado Oficial de Directivas" de repositorio.html.
 */

(function () {
    'use strict';

    const JSON_URL = 'data/normativas_agroideas.json';
    const TABLE_SELECTOR = '#tablaDirectivas';

    // Mapeo meses en español → número (01-12)
    const MESES = {
        enero: '01', febrero: '02', marzo: '03', abril: '04',
        mayo: '05', junio: '06', julio: '07', agosto: '08',
        setiembre: '09', septiembre: '09', octubre: '10',
        noviembre: '11', diciembre: '12'
    };

    /**
     * Convierte "13 de julio de 2020" → "2020-07-13" (para ordenación).
     */
    function fechaTextoAISO(texto) {
        if (!texto) return '';
        const m = String(texto).toLowerCase()
            .match(/(\d{1,2})\s+de\s+([a-zá]+)\s+de\s+(\d{4})/);
        if (!m) return '';
        const dia = m[1].padStart(2, '0');
        const mes = MESES[m[2]] || '';
        const anio = m[3];
        return mes ? `${anio}-${mes}-${dia}` : '';
    }

    function escapeHTML(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    async function init() {
        const $table = $(TABLE_SELECTOR);
        if (!$table.length) return;

        // Si ya está inicializada, destruirla limpiamente antes de re-inicializar
        if ($.fn.DataTable.isDataTable(TABLE_SELECTOR)) {
            $table.DataTable().destroy();
        }

        // Estado de carga
        $table.find('tbody').html(
            '<tr><td colspan="5" class="p-6 text-center text-slate-400 italic">Cargando directivas…</td></tr>'
        );

        let registros;
        try {
            const resp = await fetch(JSON_URL);
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            registros = await resp.json();
        } catch (err) {
            console.error('Error cargando ' + JSON_URL + ':', err);
            $table.find('tbody').html(
                '<tr><td colspan="5" class="p-6 text-center text-red-500">No se pudo cargar el listado de directivas.</td></tr>'
            );
            return;
        }

        if (!Array.isArray(registros) || registros.length === 0) {
            $table.find('tbody').html(
                '<tr><td colspan="5" class="p-6 text-center text-slate-400 italic">Sin registros disponibles.</td></tr>'
            );
            return;
        }

        // Enriquecer cada registro con fecha ISO para ordenación
        registros.forEach(r => { r._fechaISO = fechaTextoAISO(r.fecha); });

        // Limpiar tbody antes de inicializar DataTable
        $table.find('tbody').empty();

        $table.DataTable({
            data: registros,
            responsive: true,
            pageLength: 10,
            lengthMenu: [[10, 15, 20, 30, 50], [10, 15, 20, 30, 50]],
            order: [[2, 'desc']],
            dom: '<"dt-header-flex flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-slate-50/50 border-b border-slate-100"Bf>rt<"dt-footer-flex flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-slate-50/50 border-t border-slate-100"lip>',
            buttons: [
                {
                    extend: 'copy',
                    text: '<i data-lucide="copy" class="w-4 h-4 inline mr-1.5"></i> Copiar',
                    className: 'dt-button-export',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                },
                {
                    extend: 'excel',
                    text: '<i data-lucide="file-spreadsheet" class="w-4 h-4 inline mr-1.5"></i> Excel',
                    className: 'dt-button-export',
                    title: 'Listado_Oficial_Directivas_AGROIDEAS',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                },
                {
                    extend: 'pdf',
                    text: '<i data-lucide="file-text" class="w-4 h-4 inline mr-1.5"></i> PDF',
                    className: 'dt-button-export',
                    title: 'Listado Oficial de Directivas - AGROIDEAS',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                },
                {
                    extend: 'print',
                    text: '<i data-lucide="printer" class="w-4 h-4 inline mr-1.5"></i> Imprimir',
                    className: 'dt-button-export',
                    title: 'Listado Oficial de Directivas - AGROIDEAS',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                }
            ],
            autoWidth: false,
            columns: [
                {
                    data: 'titulo',
                    title: 'Título Descriptivo',
                    width: '24%',
                    render: d => '<div class="font-bold text-slate-800 text-sm leading-snug">' + escapeHTML(d) + '</div>'
                },
                {
                    data: 'resolucion_aprobatoria',
                    title: 'Resolución / Norma',
                    width: '18%',
                    render: d => '<span class="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block">' + escapeHTML(d) + '</span>'
                },
                {
                    data: null,
                    title: 'Fecha Publicación',
                    width: '13%',
                    render: (data, type) => {
                        if (type === 'sort' || type === 'type') return data._fechaISO || '';
                        return '<span class="text-xs text-slate-500 whitespace-nowrap font-medium">' + escapeHTML(data.fecha || '—') + '</span>';
                    }
                },
                {
                    data: 'descripcion',
                    title: 'Descripción Completa',
                    width: '35%',
                    render: (d, type) => {
                        if (type === 'sort' || type === 'type') return d || '';
                        return '<p class="text-xs text-slate-600 leading-relaxed font-normal text-justify">' + escapeHTML(d || '—') + '</p>';
                    }
                },
                {
                    data: 'enlace',
                    title: 'Enlace',
                    width: '10%',
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    render: d => d
                        ? '<a href="' + escapeHTML(d) + '" target="_blank" rel="noopener noreferrer" ' +
                          'class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm whitespace-nowrap">' +
                          '<i data-lucide="external-link" class="w-3.5 h-3.5"></i> Ver norma</a>'
                        : '<span class="text-slate-300">—</span>'
                }
            ],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Buscar directiva, palabra clave, resolución o año…',
                lengthMenu: 'Mostrar _MENU_ registros',
                info: 'Mostrando _START_ a _END_ de _TOTAL_ directivas',
                infoEmpty: 'No hay registros disponibles',
                infoFiltered: '(filtrado de _MAX_ registros totales)',
                zeroRecords: 'No se encontraron directivas coincidentes con la búsqueda',
                paginate: {
                    first: 'Primero',
                    last: 'Último',
                    next: 'Siguiente',
                    previous: 'Anterior'
                }
            },
            drawCallback: function () {
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    // Esperar a que jQuery y DataTables estén disponibles
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
