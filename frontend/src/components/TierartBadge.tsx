import { twMerge } from "tailwind-merge";

import { getTierartConfig } from "#/config/tierart-config.ts";
import type { Tierart } from "#/types.ts";

type TierartBadgeProps = {
  tierart: Tierart;
  size?: "sm" | "lg";
};

export function TierartBadge({ tierart, size = "sm" }: TierartBadgeProps) {
  const cat = getTierartConfig(tierart);
  const emojiSize = size === "lg" ? 16 : 13;

  return (
    <span
      className={twMerge(
        "category-badge",
        size === "lg" ? "category-badge-lg" : "category-badge-sm",
      )}
      style={{ background: cat.soft, color: cat.text }}
    >
      <span style={{ fontSize: emojiSize }}>{cat.emoji}</span>
      {cat.label}
    </span>
  );
}
