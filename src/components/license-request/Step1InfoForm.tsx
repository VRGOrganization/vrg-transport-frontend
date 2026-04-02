"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const SHIFT_OPTIONS = ["Manhã", "Tarde", "Noite", "Integral"];
const BLOOD_TYPE_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export interface Step1Data {
  institution: string;
  degree: string;
  shift: string;
  bloodType: string;
  bus: string;
}

interface Step1InfoFormProps {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onContinue: () => void;
}

export default function Step1InfoForm({ data, onChange, onContinue }: Step1InfoFormProps) {
  const set = (field: keyof Step1Data, value: string) =>
    onChange({ ...data, [field]: value });

  const isValid =
    data.institution.trim() &&
    data.degree.trim() &&
    data.shift &&
    data.bloodType &&
    data.bus.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) onContinue();
      }}
      className="space-y-5"
    >
      <Input
        label="Instituição de Ensino"
        type="text"
        icon="school"
        placeholder="Ex: UENF, UFF, IFF..."
        value={data.institution}
        onChange={(e) => set("institution", e.target.value)}
        required
      />

      <Input
        label="Curso"
        type="text"
        icon="menu_book"
        placeholder="Ex: Engenharia de Software"
        value={data.degree}
        onChange={(e) => set("degree", e.target.value)}
        required
      />

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
          Turno
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SHIFT_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => set("shift", opt)}
              className={`h-12 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                data.shift === opt
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
          Tipo Sanguíneo
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_TYPE_OPTIONS.map((bt) => (
            <button
              key={bt}
              type="button"
              onClick={() => set("bloodType", bt)}
              className={`h-12 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                data.bloodType === bt
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              {bt}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!isValid}
        icon="arrow_forward"
      >
        Continuar
      </Button>
    </form>
  );
}
