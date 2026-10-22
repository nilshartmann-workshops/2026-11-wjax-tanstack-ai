import { twMerge } from "tailwind-merge";

import { getCategoryConfig } from "#/config/category-config.ts";
import type { CategoryId } from "#/types.ts";

type CategoryBadgeProps = {
  category: CategoryId;
  size?: "sm" | "lg";
};

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const cat = getCategoryConfig(category);
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
