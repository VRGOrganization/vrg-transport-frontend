"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting";
import ActionCard from "@/components/dashboard/ActionCard";
import LicenseActionCard from "@/components/dashboard/LicenseActionCard";
import { DASHBOARD_ACTIONS } from "@/constants/dashboard-actions";

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
      <DashboardHeader onLogout={logout} />

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
        <DashboardGreeting name={user.name} />

        <nav style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
          <LicenseActionCard />
          {DASHBOARD_ACTIONS.map((action) => (
            <ActionCard key={action.href} action={action} />
          ))}
        </nav>

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
