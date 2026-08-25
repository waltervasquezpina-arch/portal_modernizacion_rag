let cursosDataCache = null;

async function fetchCursosData() {
    if (cursosDataCache) return cursosDataCache;
    try {
        const response = await fetch('data/cursos.json');
        if (!response.ok) throw new Error("Error loading data");
        cursosDataCache = await response.json();
        return cursosDataCache;
    } catch (e) {
        console.error("No se pudo cargar data/cursos.json", e);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const openModalId = params.get('openModal');
    
    if (openModalId) {
        // Seleccionar la pestaña "Conocimiento" si existe
        const btnConocimiento = document.querySelector('.tab-link[data-target="conocimiento"]');
        if(btnConocimiento) {
            btnConocimiento.click();
            
            // Expandir el acordeón "Micro-Cursos"
            const acordeonMicroCursos = document.querySelector('#accordion-conocimiento .accordion-item:last-child button');
            if (acordeonMicroCursos) {
                const item = acordeonMicroCursos.closest('.accordion-item');
                if (!item.classList.contains('active')) {
                    toggleAccordion(acordeonMicroCursos);
                }
            }
        }
        
        // Abrir el modal correspondiente
        openMicroCursoModal(openModalId);
        
        // Limpiar la URL sin recargar la página
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: cleanUrl}, '', cleanUrl);
    }
});


async function openMicroCursoModal(moduleId) {
    const data = await fetchCursosData();
    if (!data) return;

    const module = data.modulos.find(m => m.id === moduleId);
    if (!module) return;

    document.getElementById('mcModalEje').textContent = module.eje;
    document.getElementById('mcModalTitle').textContent = module.titulo;
    document.getElementById('mcModalDesc').textContent = module.descripcion;

    const container = document.getElementById('mcSubtemasContainer');
    container.innerHTML = '';

    module.subtemas.forEach((sub, index) => {
        const div = document.createElement('div');
        div.className = "bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex items-start gap-4";
        
        div.innerHTML = `
            <div class="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0 font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                ${index + 1}
            </div>
            <div class="flex-1">
                <h5 class="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">${sub.id}: ${sub.titulo}</h5>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">${sub.descripcion}</p>
            </div>
            <a href="microcurso.html?modulo=${module.id}&subtema=${sub.id}" class="shrink-0 bg-secondary/10 text-primary hover:bg-primary hover:text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1 mt-1">
                Iniciar <i data-lucide="play" class="w-3 h-3"></i>
            </a>
        `;
        container.appendChild(div);
    });

    // Reactivar iconos lucide si es necesario
    if (window.lucide) {
        lucide.createIcons();
    }

    const modal = document.getElementById('microCursoModal');
    const modalContent = modal.querySelector('div');
    
    modal.classList.remove('hidden');
    // Forzar reflow
    void modal.offsetWidth;
    
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
}

function closeMicroCursoModal() {
    const modal = document.getElementById('microCursoModal');
    const modalContent = modal.querySelector('div');
    
    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // duración de la transición
}
