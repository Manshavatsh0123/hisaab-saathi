"use client";

import { cn } from "@/lib/utils";
import type { Section } from "@/app/page";
import { Bell, Search, Calendar, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  activeSection: Section;
  onMenuClick?: () => void;
}

const sectionTitles: Record<Section, string> = {
  overview: "Overview",
  pipeline: "Add Customer",
  deals: "Customers",
  team: "Field Agents",
  reports: "Reports",
  settings: "Settings",
};

export function Header({ activeSection, onMenuClick }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-sm sm:px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3 md:gap-6">
        <button type="button" aria-label="Open navigation" onClick={onMenuClick} className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary lg:hidden"><Menu className="size-5" /></button>
        <h1 className="truncate text-lg font-semibold text-foreground sm:text-xl">
          {sectionTitles[activeSection]}
        </h1>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Search */}
        <div
          className={cn(
            "relative hidden items-center transition-all duration-300 sm:flex",
            searchFocused ? "w-64" : "w-48"
          )}
        >
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-accent transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>

        {/* User avatar */}
        <button className="w-9 h-9 rounded-lg overflow-hidden bg-secondary ring-2 ring-transparent hover:ring-accent/50 transition-all duration-200">
          <div className="w-full h-full bg-gradient-to-br from-accent/80 to-chart-1 flex items-center justify-center text-xs font-semibold text-accent-foreground">
            JD
          </div>
        </button>
      </div>
    </header>
  );
}
