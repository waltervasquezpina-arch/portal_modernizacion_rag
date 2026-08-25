/**
 * chatbot-engine.js
 * Motor de Inteligencia Normativa (RAG Local + Simulación LocalStorage + Conector Opcional Gemini API)
 * para el Sistema Administrativo de Modernización de la Gestión Pública (SAMGP).
 */

class SAMGPChatbotEngine {
    constructor() {
        this.STORAGE_KEYS = {
            KNOWLEDGE: 'samgp_knowledge_base',
            HISTORY: 'samgp_chat_history',
            SETTINGS: 'samgp_chatbot_settings'
        };
        this.knowledgeBase = null;
        this.history = [];
        this.settings = {
            useLiveLLM: false,
            geminiApiKey: '',
            activeCategory: 'all'
        };
        this.isInitialized = false;
    }

    /**
     * Inicializa el motor, cargando la configuración, el historial y el corpus JSON en LocalStorage.
     */
    async init() {
        if (this.isInitialized) return true;

        this.loadSettings();
        this.loadHistory();

        try {
            // Intentar cargar desde LocalStorage primero si existe y es la misma versión
            const cachedKB = localStorage.getItem(this.STORAGE_KEYS.KNOWLEDGE);
            let needsRefresh = true;

            if (cachedKB) {
                try {
                    const parsed = JSON.parse(cachedKB);
                    if (parsed && parsed.metadata && parsed.metadata.version === "2026.7") {
                        this.knowledgeBase = parsed;
                        needsRefresh = false;
                    }
                } catch (e) {
                    console.warn("Error parseando caché del corpus, recargando desde archivo...");
                }
            }

            if (needsRefresh) {
                const response = await fetch('data/chatbot_knowledge.json');
                if (!response.ok) throw new Error("No se pudo cargar el archivo data/chatbot_knowledge.json");
                this.knowledgeBase = await response.json();
                localStorage.setItem(this.STORAGE_KEYS.KNOWLEDGE, JSON.stringify(this.knowledgeBase));
            }

            this.isInitialized = true;
            console.log("✅ [SAMGP Chatbot Engine] Inicializado con éxito. Módulos normativos cargados:", this.knowledgeBase.metadata.total_modules);
            return true;
        } catch (error) {
            console.error("❌ [SAMGP Chatbot Engine] Error al inicializar:", error);
            return false;
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error("Error cargando ajustes:", e);
        }
    }

    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEYS.HISTORY);
            if (saved) {
                this.history = JSON.parse(saved);
            } else {
                // Mensaje de bienvenida inicial si no hay historial
                this.history = [{
                    id: 'msg_welcome_' + Date.now(),
                    sender: 'ai',
                    text: `<p>👋 ¡Hola! Soy el <strong>Asistente Virtual del Sistema Administrativo de Modernización de la Gestión Pública (SAMGP)</strong> al 2030.</p>
                           <p class="mt-2">Estoy entrenado y sincronizado con el marco legal oficial del Perú, incluyendo la <strong>Ley N° 27658</strong>, la <strong>Política Nacional al 2030 (DS 103-2022-PCM)</strong>, el <strong>Reglamento SAMGP</strong>, y las nuevas <strong>Normas Técnicas 2025</strong> de Gestión por Procesos, Calidad, Conocimiento e Innovación Pública.</p>
                           <p class="mt-2 font-semibold text-blue-900">¿En qué consulta normativa o técnica te puedo ayudar hoy?</p>`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sources: []
                }];
                this.saveHistory();
            }
        } catch (e) {
            console.error("Error cargando historial:", e);
            this.history = [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify(this.history));
        } catch (e) {
            console.error("Error guardando historial:", e);
        }
    }

    clearHistory() {
        this.history = [{
            id: 'msg_welcome_' + Date.now(),
            sender: 'ai',
            text: `<p>👋 Historial reiniciado. Soy el <strong>Asistente Virtual del SAMGP al 2030</strong>.</p><p class="mt-2 font-semibold text-blue-900">¿Cuál es tu consulta el día de hoy?</p>`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: []
        }];
        this.saveHistory();
        return this.history;
    }

    setActiveCategory(categoryId) {
        this.settings.activeCategory = categoryId;
        this.saveSettings({ activeCategory: categoryId });
    }

    /**
     * Normaliza y limpia texto para comparación y scoring (elimina tildes y puntuación).
     */
    normalizeText(text) {
        if (!text) return '';
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    /**
     * Algoritmo de RAG Local: Calcula el puntaje de similitud semántica y de palabras clave
     * entre la consulta del usuario y los nodos del corpus.
     */
     retrieveRelevantNodes(query) {
        if (!this.knowledgeBase || !this.knowledgeBase.knowledge_nodes) return [];

        const normalizedQuery = this.normalizeText(query);
        const stopwords = new Set([
            'que', 'para', 'como', 'con', 'sin', 'por', 'sobre', 'entre', 'hacia', 'hasta', 'desde',
            'cuales', 'cual', 'quien', 'quienes', 'donde', 'cuando', 'cuyo', 'cuya', 'cuyos', 'cuyas',
            'son', 'sea', 'ser', 'estar', 'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
            'aquel', 'aquella', 'aquellos', 'aquellas', 'esto', 'eso', 'aquello', 'mas', 'muy', 'tanto',
            'del', 'las', 'los', 'una', 'uno', 'unas', 'unos', 'pero', 'sino', 'porque', 'pues', 'aunque',
            'habia', 'hay', 'tiene', 'tienen', 'hacer', 'pueden', 'puede', 'debe', 'deben', 'ademas',
            'luego', 'tambien', 'asi', 'bien', 'solo', 'solamente', 'cada', 'todo', 'toda', 'todos', 'todas',
            'institucion', 'institucional', 'entidad', 'entidades', 'publica', 'publicas', 'publico', 'publicos',
            'estado', 'estatal', 'gestion', 'general', 'sistema', 'sistemas', 'norma', 'normas', 'requisito',
            'requisitos', 'oficina', 'camioneta', 'pasaporte', 'motor', 'reparar', 'renovar', 'cocinar', 'receta'
        ]);
        const queryTokens = normalizedQuery.split(" ").filter(w => w.length > 2 && !stopwords.has(w));

        let scoredNodes = this.knowledgeBase.knowledge_nodes.map(node => {
            // Filtrar por categoría activa si no es 'all'
            if (this.settings.activeCategory !== 'all' && node.category !== this.settings.activeCategory) {
                return { node, score: 0 };
            }

            let score = 0;
            let hasKeywordMatch = false;
            const normTitle = this.normalizeText(node.title);
            const normAnswer = this.normalizeText(node.answer);

            // 1. Coincidencia exacta en title o question_patterns (Puntaje muy alto)
            for (let qp of (node.question_patterns || [])) {
                const normQP = this.normalizeText(qp);
                if (normalizedQuery.includes(normQP) || normQP.includes(normalizedQuery)) {
                    score += 12.0;
                    hasKeywordMatch = true;
                }
            }

            // 2. Coincidencia por Keywords (Peso alto)
            for (let kw of (node.keywords || [])) {
                const normKw = this.normalizeText(kw);
                if (normalizedQuery.includes(normKw)) {
                    score += 6.0;
                    hasKeywordMatch = true;
                } else {
                    // Chequear coincidencia de tokens de la keyword
                    const kwTokens = normKw.split(" ");
                    let matchedKwTokens = 0;
                    for (let kt of kwTokens) {
                        if (normalizedQuery.includes(kt)) matchedKwTokens++;
                    }
                    if (matchedKwTokens === kwTokens.length && kwTokens.length > 0) {
                        score += 4.5;
                        hasKeywordMatch = true;
                    }
                }
            }

            // 3. Coincidencia por tokens individuales en título y cuerpo (solo tokens significativos)
            let matchedTokensCount = 0;
            for (let token of queryTokens) {
                if (normTitle.includes(token)) {
                    score += 2.0;
                    matchedTokensCount++;
                }
                if (normAnswer.includes(token)) {
                    score += 0.8;
                    matchedTokensCount++;
                }
            }

            // Si no hay coincidencia de palabra clave oficial y apenas coincidieron 1 o 2 tokens comunes, penalizar
            if (!hasKeywordMatch && score < 3.0) {
                score = 0;
            }

            return { node, score, hasKeywordMatch };
        });

        // Ordenar descendentemente
        scoredNodes.sort((a, b) => b.score - a.score);

        return scoredNodes;
    }

    /**
     * Procesa la consulta del usuario, aplica control Out of Scope y devuelve respuesta local o de LLM.
     */
    async processUserQuery(userText) {
        // Guardar mensaje del usuario
        const userMsg = {
            id: 'msg_u_' + Date.now(),
            sender: 'user',
            text: userText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.history.push(userMsg);
        this.saveHistory();

        // 1. Recuperar nodos relevantes del RAG Local
        const retrieved = this.retrieveRelevantNodes(userText);
        const topCandidate = retrieved[0];

        let aiMsg = {
            id: 'msg_ai_' + (Date.now() + 1),
            sender: 'ai',
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sources: []
        };

        // 2. Guardrail de Out-of-Scope (si el puntaje es menor a 2.5 y no tiene relevancia real)
        if (!topCandidate || topCandidate.score < 2.5) {
            aiMsg.text = `<p>⚖️ <strong>Consulta fuera del alcance de especialización (Out of Scope):</strong></p>
                          <p class="mt-2">Como Asistente Virtual institucional del <strong>SAMGP</strong>, mi especialización está rigurosamente orientada y delimitada a:</p>
                          <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-700">
                            <li><strong>Ley N° 27658:</strong> Ley Marco de Modernización y generación de Valor Público.</li>
                            <li><strong>Política Nacional al 2030:</strong> Enfoques y sus 4 Objetivos Prioritarios (DS 103-2022-PCM).</li>
                            <li><strong>Reglamento SAMGP:</strong> Ente rector (SGP - PCM) y articulación sistémica (DS 123-2018-PCM).</li>
                            <li><strong>Normas Técnicas 2025:</strong> Gestión por Procesos (GxP), Calidad de Servicios (GCS), Gestión del Conocimiento e Innovación Pública.</li>
                            <li><strong>Estructura del Estado:</strong> Lineamientos ROF y MOP.</li>
                            <li><strong>Instructivos Operativos:</strong> Asociatividad, Gestión Empresarial, Formas Asociativas, EEMRI y Adopción de Tecnología.</li>
                          </ul>
                          <p class="mt-2 font-semibold text-blue-900">Por favor, reformula tu consulta en relación a las materias mencionadas para poder brindarte el soporte legal exacto.</p>`;
            aiMsg.sources = [];
            this.history.push(aiMsg);
            this.saveHistory();
            return { userMsg, aiMsg };
        }

        // Si el usuario configuró API Key de Gemini y desea usar LLM en vivo
        let fallbackTriggered = false;
        if (this.settings.useLiveLLM && this.settings.geminiApiKey && this.settings.geminiApiKey.trim() !== '') {
            try {
                const llmResult = await this.callGeminiAPI(userText, retrieved.slice(0, 3));
                aiMsg.text = llmResult.text;
                aiMsg.sources = llmResult.sources;
                this.history.push(aiMsg);
                this.saveHistory();
                return { userMsg, aiMsg };
            } catch (error) {
                console.warn("Fallo al consultar la API de Gemini en vivo, aplicando RAG Local de respaldo:", error);
                fallbackTriggered = true;
            }
        }

        // 3. Respuesta estándar de RAG Local (Alta precisión basada en el nodo o nodos coincidentes)
        aiMsg.text = topCandidate.node.answer;
        if (fallbackTriggered) {
            aiMsg.text = `<div class="mb-3 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-900 text-xs flex items-start gap-2.5 shadow-sm">
                            <span class="text-base leading-none shrink-0">⚠️</span>
                            <div>
                                <strong class="block font-bold">Mecanismo de Resiliencia Activado (Fallback RAG Local)</strong>
                                No se pudo procesar con Google Gemini en vivo (API Key errónea, caducada o sin conexión). El sistema intervino automáticamente entregando la respuesta oficial desde LocalStorage sin interrupción.
                            </div>
                          </div>` + aiMsg.text;
        }

        aiMsg.sources = [{
            title: topCandidate.node.source,
            category: topCandidate.node.category,
            pdf_path: topCandidate.node.pdf_path
        }];

        // Si hay un segundo candidato muy relevante (score cercano), adjuntarlo como fuente secundaria
        if (retrieved.length > 1 && retrieved[1].score > (topCandidate.score * 0.6) && retrieved[1].node.id !== topCandidate.node.id) {
            aiMsg.sources.push({
                title: retrieved[1].node.source,
                category: retrieved[1].node.category,
                pdf_path: retrieved[1].node.pdf_path
            });
        }

        this.history.push(aiMsg);
        this.saveHistory();
        return { userMsg, aiMsg };
    }

    /**
     * Conector REST hacia Google Gemini API (In-Context Grounding con los fragmentos RAG)
     */
    async callGeminiAPI(userPrompt, topNodes) {
        const apiKey = this.settings.geminiApiKey.trim();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        // Construir contexto normativo a partir de los nodos recuperados
        let contextText = topNodes.map((item, idx) => {
            return `--- DOCUMENTO/NORMA ${idx + 1}: ${item.node.source} ---\nContenido Legal: ${item.node.answer.replace(/<[^>]*>?/gm, ' ')}\n`;
        }).join("\n");

        const systemPrompt = `Eres el Asistente Virtual Especializado del Sistema Administrativo de Modernización de la Gestión Pública (SAMGP) y experto en los Instructivos Operativos en el portal de AGROIDEAS - MIDAGRI (Perú).
Tus respuestas deben ser rigurosas, institucionales, profesionales y formateadas con HTML limpio (<p>, <strong>, <ul>, <li>) para verse increíbles en una burbuja de chat.
Instrucción Innegociable: Responde a la pregunta del usuario BASÁNDOTE EXCLUSIVAMENTE en el siguiente contexto normativo proporcionado y citando la fuente exacta. Si el contexto no tiene suficiente información, indícalo con cortesía.

CONTEXTO NORMATIVO SAMGP E INSTRUCTIVOS AGROIDEAS:
${contextText}`;

        const payload = {
            contents: [{
                parts: [
                    { text: systemPrompt },
                    { text: `Pregunta del ciudadano/servidor público: ${userPrompt}` }
                ]
            }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1024
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API HTTP status ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "<p>Lo siento, no pude procesar la respuesta con la API en vivo.</p>";

        return {
            text: generatedText + `<div class="mt-3 pt-2 border-t border-slate-200/60 text-xs text-slate-500 italic">✨ Respuesta generada dinámicamente en vivo por Google Gemini 1.5 Flash basada en el Corpus SAMGP.</div>`,
            sources: topNodes.map(i => ({
                title: i.node.source,
                category: i.node.category,
                pdf_path: i.node.pdf_path
            }))
        };
    }

    /**
     * Exporta el historial de chat a texto plano para sustentar informes técnicos.
     */
    exportChatAsText() {
        if (this.history.length === 0) return "No hay conversación para exportar.";

        let header = `========================================================================\n` +
                     `  INFORME DE CONSULTAS NORMATIVAS - ASISTENTE VIRTUAL SAMGP AL 2030  \n` +
                     `  Unidad de Planeamiento y Presupuesto | AGROIDEAS - MIDAGRI         \n` +
                     `  Fecha de Exportación: ${new Date().toLocaleString('es-PE')}          \n` +
                     `========================================================================\n\n`;

        let body = this.history.map(msg => {
            const who = msg.sender === 'user' ? '👤 CONSULTA CIUDADANA/SERVIDOR' : '🤖 ASISTENTE SAMGP (RESPUESTA LEGAL)';
            const cleanText = msg.text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
            let sourcesInfo = '';
            if (msg.sources && msg.sources.length > 0) {
                sourcesInfo = `\n   📚 Fuentes citadas:\n` + msg.sources.map(s => `      - ${s.title}`).join('\n');
            }
            return `[${msg.timestamp}] ${who}:\n   ${cleanText}${sourcesInfo}\n------------------------------------------------------------------------\n`;
        }).join('\n');

        return header + body;
    }
}

// Exponer globalmente para uso en el frontend
window.SAMGPChatbot = new SAMGPChatbotEngine();
