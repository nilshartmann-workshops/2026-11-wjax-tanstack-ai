import { CategoryBadge } from "#/components/CategoryBadge";
import Markdown from "#/components/Markdown.tsx";
import { getCategoryConfig } from "#/config/category-config.ts";
import type { Post } from "#/types.ts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type PostDetailCardProps = {
  post: Post;
  children?: React.ReactNode;
};

export function PostDetailCard({ post, children }: PostDetailCardProps) {
  const cat = getCategoryConfig(post.category);

  return (
    <div className="post-detail-card" style={{ borderColor: `${cat.color}60` }}>
      <div className="post-detail-header" style={{ background: cat.soft }}>
        <div className="post-detail-header-row">
          <CategoryBadge category={post.category} size="lg" />
          <span style={{ fontSize: 13, color: cat.text, fontWeight: 500 }}>
            {formatDate(post.createdAt)}
          </span>
        </div>
        <h1 className="post-detail-title">{post.title}</h1>
        <p className="post-detail-author">von @{post.author}</p>
      </div>

      <div className="post-detail-body">
        <Markdown
          className={"post-description prose"}
          content={post.description}
        />

        <div className="info-grid">
          <InfoGridItem icon="📍" label="Ort" value={post.location} />
          <InfoGridItem icon="⏱️" label="Zeitraum" value={post.timeframe} />
          <InfoGridItem icon="🐾" label="Tier/Pflanze" value={post.animal} />
        </div>

        {children}
      </div>
    </div>
  );
}

type InfoGridItemProps = { icon: string; label: string; value: string };

function InfoGridItem({ icon, label, value }: InfoGridItemProps) {
  return (
    <div className="info-grid-item">
      <div className="info-grid-icon">{icon}</div>
      <div className="info-grid-label">{label}</div>
      <div className="info-grid-value">{value}</div>
    </div>
  );
}
