import { Link } from "@tanstack/react-router";
import { LogOut, Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/swift-cargo-apex-logo.png.asset.json";

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight" onClick={close}>
          <img
            src={logoAsset.url}
            alt="Swift Cargo Apex logo"
            className="h-9 w-9 rounded-md object-contain"
          />
          <span className="text-lg">
            Swift<span style={{ color: "var(--accent)" }}>Cargo</span> Apex
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground bg-secondary" }}
          >
            Home
          </Link>
          <Link
            to="/track"
            search={{ tn: "" }}
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-foreground bg-secondary" }}
          >
            Track
          </Link>
          <Link
            to="/about"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-foreground bg-secondary" }}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-foreground bg-secondary" }}
          >
            Contact
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="ml-1 inline-flex items-center gap-1 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void signOut()}
              className="ml-1 gap-1"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden">
          <nav className="container mx-auto flex max-w-6xl flex-col px-4 py-3 text-sm font-medium">
            <Link
              to="/"
              onClick={close}
              className="rounded-md px-3 py-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              Home
            </Link>
            <Link
              to="/track"
              search={{ tn: "" }}
              onClick={close}
              className="rounded-md px-3 py-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              Track
            </Link>
            <Link
              to="/about"
              onClick={close}
              className="rounded-md px-3 py-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={close}
              className="rounded-md px-3 py-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={close}
                className="inline-flex items-center gap-1 rounded-md px-3 py-3 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                <Shield className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
            {user && (
              <button
                onClick={() => { void signOut(); close(); }}
                className="flex items-center gap-2 rounded-md px-3 py-3 text-left text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
