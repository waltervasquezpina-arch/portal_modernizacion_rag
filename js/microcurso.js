document.addEventListener('DOMContentLoaded', async () => {
    // 1. Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const moduleId = params.get('modulo');
    const subtemaId = params.get('subtema');

    if (!moduleId || !subtemaId) {
        alert("Faltan parámetros de curso.");
        return;
    }

    // 2. Cargar datos
    try {
        const response = await fetch('data/cursos.json');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        
        const module = data.modulos.find(m => m.id === moduleId);
        if (!module) throw new Error("Módulo no encontrado");

        const subtema = module.subtemas.find(s => s.id === subtemaId);
        if (!subtema) throw new Error("Subtema no encontrado");

        // 3. Pintar datos en la UI
        document.getElementById('moduloEjeLabel').textContent = module.eje;
        document.getElementById('moduloTituloLabel').textContent = module.titulo;
        
        document.getElementById('subtemaIdBadge').textContent = `Subtema ${subtema.id}`;
        document.getElementById('subtemaTitulo').textContent = subtema.titulo;
        document.getElementById('subtemaDesc').textContent = subtema.descripcion;
        
        document.getElementById('videoUrlPreview').textContent = subtema.video_url;

        // Configurar botón de retroceso
        const backBtn = document.getElementById('backButton');
        if (backBtn) {
            backBtn.href = `repositorio.html?openModal=${module.id}`;
        }

        // Renderizar Cuestionario
        renderQuiz(subtema.preguntas);

    } catch (e) {
        console.error("Error al cargar el curso:", e);
        document.getElementById('subtemaTitulo').textContent = "Error al cargar el curso";
        document.getElementById('subtemaDesc').textContent = e.message;
    }
});

function renderQuiz(preguntas) {
    const container = document.getElementById('quizContainer');
    
    if (!preguntas || preguntas.length === 0) {
        container.innerHTML = `<div class="p-4 bg-amber-50 text-amber-700 text-sm rounded-xl">Este subtema no tiene cuestionario asociado.</div>`;
        // Habilitar botón de finalizar automáticamente
        const btn = document.getElementById('btnFinalizar');
        btn.disabled = false;
        btn.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
        btn.classList.add('bg-primary', 'text-white', 'hover:bg-secondary');
        return;
    }

    container.innerHTML = '';
    
    preguntas.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.className = "mb-4";
        
        let html = `<p class="text-sm font-bold text-slate-800 mb-2">${index + 1}. ${q.pregunta}</p><div class="space-y-2">`;
        
        q.opciones.forEach((opcion, i) => {
            html += `
                <label class="flex items-start gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="radio" name="pregunta_${index}" value="${i}" class="mt-0.5 text-primary focus:ring-primary">
                    <span class="text-sm text-slate-600">${opcion}</span>
                </label>
            `;
        });
        
        html += `</div>`;
        qDiv.innerHTML = html;
        container.appendChild(qDiv);
    });

    // Añadir listener para validar cuando todos los radios estén marcados
    const inputs = container.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            checkQuizCompletion(preguntas.length);
        });
    });
}

function checkQuizCompletion(totalQuestions) {
    let answered = 0;
    for (let i = 0; i < totalQuestions; i++) {
        const selected = document.querySelector(`input[name="pregunta_${i}"]:checked`);
        if (selected) answered++;
    }

    // Progreso
    const percentage = (answered / totalQuestions) * 100;
    document.getElementById('progressBar').style.width = `${percentage}%`;

    // Habilitar botón si terminó
    if (answered === totalQuestions) {
        const btn = document.getElementById('btnFinalizar');
        btn.disabled = false;
        btn.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
        btn.classList.add('bg-primary', 'text-white', 'hover:bg-secondary');
    }
}
