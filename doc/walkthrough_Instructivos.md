# Walkthrough: Incorporación del Módulo de Instructivos Operativos

El Asistente Virtual SAMGP ahora incluye un componente clave para las operaciones de AGROIDEAS: el **Módulo de Instructivos Operativos**. 

A continuación, resumo los cambios realizados y validados durante este proceso:

## 1. Expansión de la Base de Conocimiento (`chatbot_knowledge.json`)
- Se creó una nueva categoría lógica: `instructivos_agroideas`.
- Se añadieron 5 nodos RAG detallados para soportar consultas directas sobre las resoluciones e instructivos depositados en el repositorio documental:
  - **Asociatividad:** `node_011`
  - **Gestión Empresarial:** `node_012`
  - **Formas Asociativas:** `node_013`
  - **Mujeres Rurales e Indígenas (EEMRI):** `node_014`
  - **Adopción de Tecnología (PNT):** `node_015`

## 2. Actualización de las Restricciones Inteligentes (`chatbot-engine.js`)
- Se actualizó el mecanismo *Out-of-Scope* para que ahora permita preguntas sobre los instructivos sin catalogarlas como inválidas.
- Se reestructuró el *System Prompt* base de Gemini, indicándole al LLM que su nivel de especialización incluye no solo las políticas nacionales, sino también las reglas operativas de AGROIDEAS.

## 3. Despliegue en Interfaz Gráfica (`chatbot.html`)
- **[Aprobado y Ejecutado]** Se incorporó formalmente un nuevo botón dinámico en la barra lateral (Sidebar) del Chatbot.
- Etiquetado como **"8. Instructivos Operativos"**, este botón permite al usuario aislar y filtrar las respuestas para que el motor busque **única y exclusivamente** dentro de las normas operativas.
- Utiliza el icono `file-text` (color esmeralda) manteniendo total coherencia y armonía con el diseño Glassmorphism implementado.

> [!TIP]
> **Recomendación para pruebas:** Puedes abrir la página `chatbot.html` y realizar cualquiera de las 18 pruebas detalladas en el Plan de Implementación para confirmar tanto la precisión de las respuestas (casos funcionales positivos) como la detección de escenarios de negación (resiliencia).
