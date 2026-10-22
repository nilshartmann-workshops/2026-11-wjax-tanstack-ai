import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { useState } from "react";

import { ChatPanel } from "#/components/chat/ChatPanel";
import { MailWidget } from "#/components/MailWidget.tsx";

const showDevToolsPanel = true;

export type AppRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  // Der Assistent haengt im Root-Layout und nicht auf einer eigenen Seite: Er
  // bleibt beim Navigieren stehen, und man sieht die Antwortliste daneben
  // aktuell werden.
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="site-header">
          <MailWidget />
          <Nav />
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <DevToolsPanel />
      </div>

      {chatOpen ? (
        <ChatPanel onClose={() => setChatOpen(false)} />
      ) : (
        <button
          type="button"
          className="chat-open-btn"
          onClick={() => setChatOpen(true)}
        >
          🐾 Assistent
        </button>
      )}
    </div>
  );
}

function Nav() {
  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-icon">🏠</span>
          <span className="nav-logo-text">hütly</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            activeProps={{ className: "nav-link nav-link-active" }}
            inactiveProps={{ className: "nav-link nav-link-inactive" }}
          >
            Start
          </Link>
          <Link
            to="/posts"
            activeProps={{ className: "nav-link nav-link-active" }}
            inactiveProps={{ className: "nav-link nav-link-inactive" }}
          >
            Gesuche
          </Link>
          <Link
            to="/offers"
            activeProps={{ className: "nav-link nav-link-active" }}
            inactiveProps={{ className: "nav-link nav-link-inactive" }}
          >
            Angebote
          </Link>
          <Link to="/posts/new" className="nav-cta">
            + Einstellen
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-title">🏠 hütly</div>
      <p className="site-footer-tagline">
        Dein Tier. Dein Urlaub. Kein Stress.
      </p>
    </footer>
  );
}

function DevToolsPanel() {
  if (!showDevToolsPanel) {
    return null;
  }

  return (
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
  );
}
