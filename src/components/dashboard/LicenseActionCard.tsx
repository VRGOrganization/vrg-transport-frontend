"use client";

import { Suspense } from "react";
import Link from "next/link";
import { CreditCard, BadgeCheck } from "lucide-react";
import { useLicense } from "@/hooks/useLicense";

function Skeleton() {
  return (
    <div className="rounded-xl bg-surface-container-low animate-pulse h-[88px] border border-outline-variant/30" />
  );
}

function LicenseActionCardInner() {
  const { loading, hasLicense } = useLicense();

  if (loading) return <Skeleton />;

  if (!hasLicense) {
    return (
      <Link
        href="/dashboard/request-license"
        className="flex items-center justify-between p-6 rounded-xl bg-secondary active:scale-95 transition-all duration-200"
        style={{ boxShadow: "0 4px 20px var(--shadow-secondary)" }}
      >
        <div>
          <h3 className="font-headline font-bold text-white text-lg mb-1">
            Criar carteirinha
          </h3>
          <p className="text-white/80 text-sm">
            Solicite sua carteira estudantil
          </p>
        </div>
        <div className="bg-black/10 rounded-full p-3 shrink-0 ml-4">
          <CreditCard className="text-white w-7 h-7" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard/identification"
      className="relative overflow-hidden flex items-center justify-between p-6 rounded-xl bg-primary active:scale-95 transition-all duration-200"
      style={{ boxShadow: "0 4px 20px var(--shadow-primary)" }}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[var(--shadow-primary-overlay)] to-transparent" />

      <div className="relative z-10">
        <h3 className="font-headline font-bold text-white text-lg mb-1">
          Identificação do estudante
        </h3>
        <p className="text-white/80 text-sm">
          Dados pessoais e acadêmicos
        </p>
      </div>

      <div className="relative z-10 bg-white/10 rounded-full p-3 shrink-0 ml-4">
        <BadgeCheck className="text-white w-7 h-7" />
      </div>
    </Link>
  );
}

export default function LicenseActionCard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <LicenseActionCardInner />
    </Suspense>
  );
}