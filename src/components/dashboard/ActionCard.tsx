"use client";

import Link from "next/link";
import { DashboardAction } from "@/constants/dashboard-actions";

interface ActionCardProps {
  action: DashboardAction;
}

export default function ActionCard({ action }: ActionCardProps) {
  const boxShadow = action.overlay
    ? `0 4px 20px var(--shadow-primary)`
    : action.bg === "bg-secondary"
    ? `0 4px 20px var(--shadow-secondary)`
    : action.bg === "bg-surface-container-low"
    ? "none"
    : `0 4px 20px var(--shadow-tertiary)`;

  const border =
    action.bg === "bg-surface-container-low"
      ? `1px solid var(--shadow-border)`
      : "none";

  return (
    <Link
      href={action.href}
      className={`group relative overflow-hidden ${action.bg} rounded-xl active:scale-95 transition-all duration-200`}
      style={{
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow,
        border,
      }}
    >
      {action.overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, var(--shadow-primary-overlay) 0%, transparent 100%)",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 10 }}>
        <h3
          className={`font-headline font-bold ${action.titleColor}`}
          style={{ fontSize: "18px", marginBottom: "4px" }}
        >
          {action.title}
        </h3>
        <p className={action.descColor} style={{ fontSize: "13px" }}>
          {action.description}
        </p>
      </div>

      <div
        className={`${action.iconBg} rounded-full`}
        style={{
          position: "relative",
          zIndex: 10,
          padding: "12px",
          flexShrink: 0,
          marginLeft: "16px",
        }}
      >
        <span
          className={`material-symbols-outlined ${action.iconColor}`}
          style={{ fontSize: "28px", display: "block" }}
        >
          {action.icon}
        </span>
      </div>
    </Link>
  );
}
