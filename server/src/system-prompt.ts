import { CURRENT_USER } from "./huetly-api.ts";

/** Was der Assistent über hütly wissen muss, bevor er das erste Tool sieht. */
export const SYSTEM_PROMPT = `
Ich weiß, dass ich nichts weiß.
`.trim();
