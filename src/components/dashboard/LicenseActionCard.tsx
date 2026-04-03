"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useLicense } from "@/hooks/useLicense";

function LicenseActionCardInner() {
  const { loading, hasLicense } = useLicense();

  if (loading) {
    return (
      <div
        className="rounded-xl bg-surface-container-low animate-pulse"
        style={{ height: "88px", border: "1px solid var(--shadow-border)" }}
      />
    );
  }

  if (!hasLicense) {
    return (
      <Link
        href="/dashboard/request-license"
        className="group relative overflow-hidden bg-secondary rounded-xl active:scale-95 transition-all duration-200"
        style={{
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 20px var(--shadow-secondary)",
        }}
      >
        <div>
          <h3 className="font-headline font-bold text-white" style={{ fontSize: "18px", marginBottom: "4px" }}>
            Criar carteirinha
          </h3>
          <p className="text-white/80" style={{ fontSize: "13px" }}>
            Solicite sua carteira estudantil
          </p>
        </div>
        <div className="bg-black/10 rounded-full" style={{ padding: "12px", flexShrink: 0, marginLeft: "16px" }}>
          <span className="material-symbols-outlined text-white" style={{ fontSize: "28px", display: "block" }}>
            add_card
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard/identification"
      className="group relative overflow-hidden bg-primary rounded-xl active:scale-95 transition-all duration-200"
      style={{
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px var(--shadow-primary)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, var(--shadow-primary-overlay) 0%, transparent 100%)" }}
      />
      <div style={{ position: "relative", zIndex: 10 }}>
        <h3 className="font-headline font-bold text-white" style={{ fontSize: "18px", marginBottom: "4px" }}>
          Identificação do estudante
        </h3>
        <p className="text-white/80" style={{ fontSize: "13px" }}>
          Dados pessoais e acadêmicos
        </p>
      </div>
      <div className="bg-surface-container-lowest/10 rounded-full" style={{ padding: "12px", flexShrink: 0, marginLeft: "16px", position: "relative", zIndex: 10 }}>
        <span className="material-symbols-outlined text-white" style={{ fontSize: "28px", display: "block" }}>
          badge
        </span>
      </div>
    </Link>
  );
}

export default function LicenseActionCard() {
  return (
    <Suspense
      fallback={
        <div
          className="rounded-xl bg-surface-container-low animate-pulse"
          style={{ height: "88px", border: "1px solid var(--shadow-border)" }}
        />
      }
    >
      <LicenseActionCardInner />
    </Suspense>
  );
}
