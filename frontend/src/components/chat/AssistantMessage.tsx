type AssistantMessageProps = {
  children: React.ReactNode;
};

/**
 * Eine Nachricht des Assistenten: links die Pfote, rechts die Parts
 * untereinander.
 */
export function AssistantMessage({ children }: AssistantMessageProps) {
  return (
    <div className="chat-turn">
      <span className="chat-avatar" aria-hidden="true">
        🐾
      </span>
      <div className="chat-turn-parts">{children}</div>
    </div>
  );
}
