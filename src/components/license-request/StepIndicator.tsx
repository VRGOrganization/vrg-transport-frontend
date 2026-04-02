"use client";

interface StepIndicatorProps {
  current: 1 | 2;
}

const STEPS = [
  { number: 1, label: "Informações" },
  { number: 2, label: "Documentos" },
];

export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "32px" }}>
      {STEPS.map((step, index) => {
        const done = step.number < current;
        const active = step.number === current;

        return (
          <div key={step.number} style={{ display: "flex", alignItems: "center", flex: index < STEPS.length - 1 ? 1 : undefined }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div
                className={`rounded-full flex items-center justify-center transition-all ${
                  done
                    ? "bg-primary"
                    : active
                    ? "bg-primary"
                    : "bg-surface-container-high"
                }`}
                style={{ width: "36px", height: "36px" }}
              >
                {done ? (
                  <span className="material-symbols-outlined text-white" style={{ fontSize: "18px" }}>
                    check
                  </span>
                ) : (
                  <span
                    className={`font-bold text-sm ${active ? "text-white" : "text-on-surface-variant"}`}
                  >
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className={`text-xs font-semibold ${active ? "text-primary" : "text-on-surface-variant"}`}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`transition-all ${done ? "bg-primary" : "bg-surface-container-high"}`}
                style={{ height: "2px", flex: 1, margin: "0 8px", marginBottom: "20px" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
