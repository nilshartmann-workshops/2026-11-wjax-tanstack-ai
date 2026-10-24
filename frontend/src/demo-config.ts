/** Die Schalter für die Vorführung, alle an einer Stelle. */

/** Zeigt rechts unten den Knopf „Assistent“, der das Chat-Panel öffnet. */
export const enableAssistant = false;

/** Zeigt links unten den Knopf der Devtools von TanStack AI. */
export const enableAiDevTools = false;

/** Zeigt links unten den Knopf der Devtools von TanStack Query. */
export const enableQueryDevTools = false;

/**
 * Simuliert ein langsames Modell, in Millisekunden, 0 schaltet ab. Bei 80
 * erscheint der Text Stück für Stück, und vor jedem Tool steht der
 * Ladezustand zwei Sekunden lang. Der Vite-Proxy schickt den Wert als Header
 * `x-huetly-slow` an den Chat-Server und startet bei einer Änderung neu.
 */
export const slowResponseMs = 0;
