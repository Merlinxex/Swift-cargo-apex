import { Link } from "@tanstack/react-router";
import { LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/swift-cargo-apex-logo.png.asset.json";

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <img
            src={logoAsset.url}
            alt="Swift Cargo Apex logo"
            className="h-9 w-9 rounded-md object-contain"
          />
          <span className="text-lg">
            Swift<span style={{ color: "var(--accent)" }}>Cargo</span> Apex
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
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
            className="hidden rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-block"
            activeProps={{ className: "text-foreground bg-secondary" }}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hidden rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-block"
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
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          )}

        </nav>
      </div>
    </header>
  );
}
