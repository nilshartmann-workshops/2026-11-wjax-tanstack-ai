export function AntwortLoadingIndicator() {
  return (
    <div role="status" aria-label="Antworten werden geladen…">
      <div className="replies-header">
        <h2 className="card-title">Antworten</h2>
      </div>

      <div className="replies-list">
        <AntwortCardSkeleton />
        <AntwortCardSkeleton />
        <AntwortCardSkeleton />
      </div>
    </div>
  );
}

function AntwortCardSkeleton() {
  return (
    <div className="reply-card reply-card-skeleton">
      <div className="reply-card-header">
        <div className="reply-author-row">
          <div className="skeleton-avatar" />
          <div className="skeleton-line skeleton-author" />
        </div>
        <div className="skeleton-line skeleton-date" />
      </div>
      <div className="skeleton-line skeleton-text" />
      <div className="skeleton-line skeleton-text skeleton-text-short" />
    </div>
  );
}
