import { Link } from "react-router-dom";
import { Zap, Github } from "lucide-react";

const LINKS = [
  { to: "/about-platform", label: "Architecture" },
  { to: "/input", label: "Job Optimizer" },
  { to: "/resume-wizard", label: "Resume Wizard" },
  { to: "/match-intelligence", label: "Match AI" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-0">
      <div className="swiss-container py-10">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="brand-logo">FutureJobFit</span>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-180"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="swiss-divider mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Built with React, Vite, and Tailwind CSS.
            Minimal. Futuristic. Swiss.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors duration-180 cursor-pointer"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}