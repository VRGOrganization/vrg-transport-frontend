"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  current: 1 | 2 | 3;
}

const STEPS = [
  { number: 1, label: "Informações" },
  { number: 2, label: "Documentos" },
  { number: 3, label: "Grade" },
] as const;

export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, index) => {
        const done = step.number < current;
        const active = step.number === current;
        const last = index === STEPS.length - 1;

        return (
          <div key={step.number} className={cn("flex items-center", !last && "flex-1")}>
            {/* Círculo + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                  done || active ? "bg-primary" : "bg-surface-container-high"
                )}
              >
                {done ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                ) : (
                  <span className={cn("text-sm font-bold", active ? "text-white" : "text-on-surface-variant")}>
                    {step.number}
                  </span>
                )}
              </div>
              <span className={cn("text-xs font-semibold", active ? "text-primary" : "text-on-surface-variant")}>
                {step.label}
              </span>
            </div>

            {/* Conector */}
            {!last && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300",
                  done ? "bg-primary" : "bg-surface-container-high"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}