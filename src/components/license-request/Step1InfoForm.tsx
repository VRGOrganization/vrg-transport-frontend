// components/license-request/Step1InfoForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";
import { useInstitutionAutocomplete } from "@/hooks/useInstitutionAutocomplete";

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

const SHIFT_OPTIONS = [
  { value: "Manhã", label: "Manhã" },
  { value: "Tarde", label: "Tarde" },
  { value: "Noite", label: "Noite" },
  { value: "Integral", label: "Integral" },
];

const BLOOD_TYPE_OPTIONS = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
];

export default function Step1InfoForm({ data, onChange, onContinue }: Step1InfoFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Step1Data, boolean>>>({});

  const {
    institutionOptions,
    courseOptions,
    handleInstitutionChange,
    handleCourseChange,
    institution,
    course,
  } = useInstitutionAutocomplete(data.institution, data.degree);

  const updateFormData = (updates: Partial<Step1Data>) => {
    const newData = { ...data, ...updates };
    onChange(newData);
    
    // Limpa o erro do campo que está sendo atualizado
    const fieldName = Object.keys(updates)[0] as keyof Step1Data;
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const onInstitutionChange = (newInstitution: string) => {
    handleInstitutionChange(newInstitution);
    updateFormData({ institution: newInstitution, degree: "" });
  };

  const onCourseChange = (newCourse: string) => {
    handleCourseChange(newCourse);
    updateFormData({ degree: newCourse });
  };

  // Função de validação
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Step1Data, string>> = {};
    
    if (!data.institution || data.institution.trim() === "") {
      newErrors.institution = "Instituição de ensino é obrigatória";
    }
    
    if (!data.degree || data.degree.trim() === "") {
      newErrors.degree = "Curso é obrigatório";
    }
    
    if (!data.shift || data.shift === "") {
      newErrors.shift = "Turno é obrigatório";
    }
    
    if (!data.bloodType || data.bloodType === "") {
      newErrors.bloodType = "Tipo sanguíneo é obrigatório";
    }
    
    setErrors(newErrors);
    
    // Marca todos os campos como "tocados" para mostrar os erros
    const allTouched: Partial<Record<keyof Step1Data, boolean>> = {
      institution: true,
      degree: true,
      shift: true,
      bloodType: true,
    };
    setTouched(allTouched);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onContinue();
    }
  };

  // Função para marcar campo como "tocado" quando o usuário interage
  const markAsTouched = (field: keyof Step1Data) => {
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <AutocompleteInput
          label="Instituição de Ensino"
          icon="school"
          placeholder="Digite o nome da faculdade"
          options={institutionOptions}
          value={institution}
          onValueChange={onInstitutionChange}
          onBlur={() => markAsTouched("institution")}
  
        />
      </div>

      <div>
        <AutocompleteInput
          label="Curso"
          icon="menu_book"
          placeholder="Digite o nome do curso"
          options={courseOptions}
          value={course}
          onValueChange={onCourseChange}
          disabled={!institution}
          onBlur={() => markAsTouched("degree")}
         
        />
      </div>

      {/* Turno - Select estilizado */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
          Turno <span className="text-error">*</span>
        </label>
        <select
          value={data.shift}
          onChange={(e) => {
            updateFormData({ shift: e.target.value });
            markAsTouched("shift");
          }}
          onBlur={() => markAsTouched("shift")}
          className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-surface-container-low text-on-surface border transition-all outline-none
            ${touched.shift && errors.shift 
              ? "border-error focus:border-error focus:ring-error/20" 
              : "border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary"
            }`}
        >
          <option value="" disabled>Selecione o turno</option>
          {SHIFT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {touched.shift && errors.shift && (
          <p className="text-xs text-error mt-1 ml-1">{errors.shift}</p>
        )}
      </div>

      {/* Tipo Sanguíneo - Select estilizado */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
          Tipo Sanguíneo <span className="text-error">*</span>
        </label>
        <select
          value={data.bloodType}
          onChange={(e) => {
            updateFormData({ bloodType: e.target.value });
            markAsTouched("bloodType");
          }}
          onBlur={() => markAsTouched("bloodType")}
          className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-surface-container-low text-on-surface border transition-all outline-none
            ${touched.bloodType && errors.bloodType 
              ? "border-error focus:border-error focus:ring-error/20" 
              : "border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary"
            }`}
        >
          <option value="" disabled>Selecione o tipo sanguíneo</option>
          {BLOOD_TYPE_OPTIONS.map((bt) => (
            <option key={bt} value={bt}>
              {bt}
            </option>
          ))}
        </select>
        {touched.bloodType && errors.bloodType && (
          <p className="text-xs text-error mt-1 ml-1">{errors.bloodType}</p>
        )}
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleContinue}
        icon="arrow_forward"
      >
        Continuar
      </Button>
    </div>
  );
}