"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LogOut, Menu } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header
      className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30"
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        paddingInline: "16px",
      }}
    >
      {/* Esquerda — menu */}
      <button
        className="text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95 flex-shrink-0"
        style={{ padding: "8px" }}
      >
        <Menu size={20} />
      </button>

      {/* Centro — título */}
      <h1
        className="font-headline font-bold text-on-surface flex-1 text-center tracking-tight"
        style={{ fontSize: "16px" }}
      >
        Transporte São Fidélis
      </h1>

      {/* Direita — tema + sair (só ícones) */}
      <div className="flex items-center gap-1 shrink-0">
        <ThemeToggle className="text-on-surface-variant hover:bg-surface-container-low" />
        <button
          onClick={onLogout}
          title="Sair"
          className="text-on-surface-variant hover:text-error hover:bg-surface-container-low rounded-full transition-colors active:scale-95"
          style={{ padding: "8px" }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}