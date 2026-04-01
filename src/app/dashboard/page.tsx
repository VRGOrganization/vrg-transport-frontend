"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const actions = [
  {
    href: "/dashboard/identification",
    title: "Identificação do estudante",
    description: "Dados pessoais e acadêmicos",
    icon: "badge",
    bg: "bg-primary",
    iconBg: "bg-white/10",
    titleColor: "text-white",
    descColor: "text-white/80",
    iconColor: "text-white",
    overlay: true,
  },
  {
    href: "/dashboard/documents",
    title: "Envio de Documentos",
    description: "Atualize sua documentação",
    icon: "upload_file",
    bg: "bg-secondary",
    iconBg: "bg-black/10",
    titleColor: "text-white",
    descColor: "text-white/80",
    iconColor: "text-white",
    overlay: false,
  },
  {
    href: "/dashboard/card",
    title: "Visualização da carteirinha",
    description: "Sua carteira digital QR Code",
    icon: "qr_code_2",
    bg: "bg-tertiary",
    iconBg: "bg-white/10",
    titleColor: "text-white",
    descColor: "text-white/80",
    iconColor: "text-white",
    overlay: false,
  },
  {
    href: "/dashboard/profile",
    title: "Alteração de informações",
    description: "Editar perfil e preferências",
    icon: "manage_accounts",
    bg: "bg-surface-container-low",
    iconBg: "bg-surface-container-high",
    titleColor: "text-on-surface",
    descColor: "text-on-surface-variant",
    iconColor: "text-primary",
    overlay: false,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <>
      {/* TopAppBar */}
      <header
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm"
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

        <button
          onClick={logout}
          className="rounded-full overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all active:scale-95"
          style={{ width: "40px", height: "40px" }}
          title="Sair"
        >
          <div
            className="w-full h-full bg-primary flex items-center justify-center"
          >
            <span
              className="material-symbols-outlined text-white"
              style={{ fontSize: "20px" }}
            >
              person
            </span>
          </div>
        </button>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          paddingTop: "96px",
          paddingBottom: "32px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "512px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Greeting */}
        <section style={{ marginBottom: "40px" }}>
          <h2
            className="font-headline font-extrabold text-primary leading-tight"
            style={{ fontSize: "30px", marginBottom: "8px" }}
          >
            Seja bem vindo, aluno!
          </h2>
          <p
            className="text-on-surface-variant font-medium"
            style={{ fontSize: "15px" }}
          >
            Gerencie seu transporte universitário de forma simples e rápida.
          </p>
        </section>

        {/* Action Cards */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group relative overflow-hidden ${action.bg} rounded-xl active:scale-95 transition-all duration-200`}
              style={{
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: action.overlay
                  ? "0 4px 20px rgba(0,63,135,0.25)"
                  : action.bg === "bg-secondary"
                  ? "0 4px 20px rgba(163,62,0,0.25)"
                  : action.bg === "bg-surface-container-low"
                  ? "none"
                  : "0 4px 20px rgba(8,65,126,0.25)",
                border: action.bg === "bg-surface-container-low"
                  ? "1px solid rgba(194,198,212,0.3)"
                  : "none",
              }}
            >
              {/* Overlay gradient no card azul */}
              {action.overlay && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,86,179,0.2) 0%, transparent 100%)",
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
                <p
                  className={action.descColor}
                  style={{ fontSize: "13px" }}
                >
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
          ))}
        </nav>

        {/* Branding rodapé */}
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            justifyContent: "center",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "36px", display: "block", marginBottom: "8px" }}
            >
              directions_bus
            </span>
            <p
              className="font-headline font-extrabold uppercase tracking-widest"
              style={{ fontSize: "10px" }}
            >
              Prefeitura de São Fidélis
            </p>
          </div>
        </div>
      </main>
    </>
  );
}