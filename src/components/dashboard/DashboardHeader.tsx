"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header
      className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md shadow-sm"
      style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <button
        className="text-primary hover:bg-surface-container-low rounded-full transition-colors active:scale-95"
        style={{ padding: "8px" }}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <h1
        className="font-headline font-bold text-primary tracking-tight"
        style={{ fontSize: "18px" }}
      >
        Transporte São Fidélis
      </h1>

      <div className="flex items-center gap-1">
        <ThemeToggle className="text-on-surface-variant hover:bg-surface-container-low" />
        <button
        onClick={onLogout}
        className="flex items-center gap-2 text-primary hover:bg-surface-container-low rounded-full px-3 py-2 transition-colors active:scale-95"
        title="Sair"
        >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "20px" }}
        >
          logout
        </span>
        <span className="text-sm font-medium">Sair</span>
      </button>
      </div>
    </header>
  );
}
