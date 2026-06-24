import { Link } from "@tanstack/react-router";
import { LogOut, Menu, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-2"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
              <span className="hidden text-sm font-medium sm:inline">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/track" search={{ tn: "" }}>Track</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/about">About</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/contact">Contact</Link>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Admin
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            {user && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

