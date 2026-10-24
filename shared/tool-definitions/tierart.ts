import { z } from "zod";

/** Die Tierarten von hütly, wie im Formular für ein neues Gesuch. */
export const tierart = z.enum([
  "Katze",
  "Hund",
  "Reptil",
  "Pflanze",
  "Sonstiges",
]);
