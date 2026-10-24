type UserMessageProps = {
  children: React.ReactNode;
};

/** Eine Nachricht des Nutzers: eine Blase am rechten Rand. */
export function UserMessage({ children }: UserMessageProps) {
  return <div className="chat-user">{children}</div>;
}
