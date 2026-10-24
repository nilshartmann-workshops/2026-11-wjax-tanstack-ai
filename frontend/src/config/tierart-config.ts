import type { Tierart } from "#/types.ts";

type TierartConfig = {
  id: Tierart;
  label: string;
  emoji: string;
  color: string;
  soft: string;
  text: string;
};

export const TIERART_CONFIGS: TierartConfig[] = [
  {
    id: "Katze",
    label: "Katze",
    emoji: "🐱",
    color: "#d4a8e0",
    soft: "#f0e2f7",
    text: "#6b3f82",
  },
  {
    id: "Hund",
    label: "Hund",
    emoji: "🐶",
    color: "#a8c8e8",
    soft: "#deeef9",
    text: "#2a5f8a",
  },
  {
    id: "Reptil",
    label: "Reptil",
    emoji: "🐢",
    color: "#a8d4b8",
    soft: "#d8f0e0",
    text: "#2a6645",
  },
  {
    id: "Pflanze",
    label: "Pflanze",
    emoji: "🌿",
    color: "#c8d8a0",
    soft: "#e8f0cc",
    text: "#4a6420",
  },
  {
    id: "Sonstiges",
    label: "Sonstiges",
    emoji: "✨",
    color: "#f0c898",
    soft: "#fce8cc",
    text: "#8a5020",
  },
];

export function getTierartConfig(key: Tierart): TierartConfig {
  const cat = TIERART_CONFIGS.find((c) => c.id === key);
  if (!cat) {
    throw new Error(`Unbekannte Tierart: '${key}'`);
  }

  return cat;
}
