/** Bausteine, die Gesuch- und Angebotskarten gemeinsam benutzen. */

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type MetaRowProps = { icon: string; text: string };

export function MetaRow({ icon, text }: MetaRowProps) {
  return (
    <div className="meta-row">
      <span className="meta-icon">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

type InfoGridItemProps = { icon: string; label: string; value: string };

export function InfoGridItem({ icon, label, value }: InfoGridItemProps) {
  return (
    <div className="info-grid-item">
      <div className="info-grid-icon">{icon}</div>
      <div className="info-grid-label">{label}</div>
      <div className="info-grid-value">{value}</div>
    </div>
  );
}

export const TITLE_LINK_CLASS =
  "inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[transform,background-size,letter-spacing] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.015] hover:bg-[length:100%_2px] hover:tracking-[0.01em]";
