import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";

import { ChatAssistant } from "#/components/chat/ChatAssistant";
import { Devtools } from "#/components/Devtools";
import { MailWidget } from "#/components/MailWidget.tsx";
import { enableAssistant } from "#/demo-config.ts";

export type AppRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
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
        <Devtools />
      </div>

      {enableAssistant && <ChatAssistant />}
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
            to="/gesuche"
            activeProps={{ className: "nav-link nav-link-active" }}
            inactiveProps={{ className: "nav-link nav-link-inactive" }}
          >
            Gesuche
          </Link>
          <Link
            to="/angebote"
            activeProps={{ className: "nav-link nav-link-active" }}
            inactiveProps={{ className: "nav-link nav-link-inactive" }}
          >
            Angebote
          </Link>
          <Link to="/gesuche/neu" className="nav-cta">
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
