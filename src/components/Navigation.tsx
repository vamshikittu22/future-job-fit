import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-nav">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              ResumeAI
            </h1>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {!isHome && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
            )}
            
            {location.pathname !== "/input" && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/input">
                  New Analysis
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}