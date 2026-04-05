"use client";

interface DashboardGreetingProps {
  name: string;
}

export default function DashboardGreeting({ name }: DashboardGreetingProps) {
  const firstName = name.split(" ")[0];

  return (
    <section style={{ marginBottom: "40px" }}>
      <h2
        className="font-headline font-extrabold text-primary leading-tight"
        style={{ fontSize: "30px", marginBottom: "8px" }}
      >
        Seja bem vindo, {firstName}!
      </h2>
      <p
        className="text-on-surface-variant font-medium"
        style={{ fontSize: "15px" }}
      >
        Gerencie seu transporte universitário de forma simples e rápida.
      </p>
    </section>
  );
}
