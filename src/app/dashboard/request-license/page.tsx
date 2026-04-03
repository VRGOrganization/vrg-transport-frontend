// app/request-license/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import StepIndicator from "@/components/license-request/StepIndicator";
import Step1InfoForm, { Step1Data } from "@/components/license-request/Step1InfoForm";
import Step2Documents, { DocumentFiles } from "@/components/license-request/Step2Documents";
import { LICENSE_DOCUMENTS } from "@/constants/license-documents";
import Step3Grade, { Step3Data } from "@/components/license-request/Step3grade";

const STORAGE_KEY = "license_request_step1";
const STORAGE_KEY_STEP3 = "license_request_step3";

const EMPTY_STEP1: Step1Data = {
  institution: "",
  degree: "",
  shift: "",
  bloodType: "",
  bus: "",
};

const EMPTY_STEP3: Step3Data = {
  selections: [],
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function RequestLicensePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1, setStep1] = useState<Step1Data>(EMPTY_STEP1);
  const [step3, setStep3] = useState<Step3Data>(EMPTY_STEP3);
  const [files, setFiles] = useState<DocumentFiles>(
    Object.fromEntries(LICENSE_DOCUMENTS.map((d) => [d.photoType, null]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedStep1 = localStorage.getItem(STORAGE_KEY);
    if (savedStep1) {
      try {
        setStep1(JSON.parse(savedStep1));
      } catch {
        // ignora JSON inválido
      }
    }
    
    const savedStep3 = localStorage.getItem(STORAGE_KEY_STEP3);
    if (savedStep3) {
      try {
        setStep3(JSON.parse(savedStep3));
      } catch {
        // ignora JSON inválido
      }
    }
  }, []);

  // Função chamada quando clica em "Continuar" no Step1
  const handleContinueFromStep1 = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(step1));
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Função chamada quando clica em "Voltar" no Step2
  const handleBackFromStep2 = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Função chamada quando clica em "Continuar para Grade Horária" no Step2
  const handleContinueFromStep2 = () => {
    // Salva os dados do step1 (opcional, mas mantém consistência)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(step1));
    // Avança para o step 3
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Função chamada quando clica em "Voltar" no Step3
  const handleBackFromStep3 = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Função que faz a requisição final ao backend (chamada no Step3)
  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      // Salva o step3 no localStorage antes de enviar
      localStorage.setItem(STORAGE_KEY_STEP3, JSON.stringify(step3));

      // 1. Envia dados do passo 1 (informações pessoais/acadêmicas)
      await api.patch("/student/me", {
        institution: step1.institution,
        degree: step1.degree,
        shift: step1.shift,
        bloodType: step1.bloodType,
        bus: step1.bus,
      });

      // 2. Envia os documentos
      for (const doc of LICENSE_DOCUMENTS) {
        const file = files[doc.photoType];
        if (!file) continue;

        const base64 = await fileToBase64(file);
        await api.post("/image/me", {
          photoType: doc.photoType,
          photo3x4: base64,
        });
      }

      // 3. Envia os dados do passo 3 (horários selecionados)
      await api.post("/student/schedule", {
        selections: step3.selections,
      });

      // Limpa os dados salvos
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_STEP3);
      
      // Redireciona para o dashboard com flag de sucesso
      router.push("/dashboard?requested=true");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message ?? "Erro ao enviar pedido. Tente novamente.");
      // Se houver erro, volta para o topo da página
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md shadow-sm flex items-center gap-3 px-4 h-16">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 className="font-headline font-bold text-on-surface text-lg flex-1">
          Solicitar Carteirinha
        </h1>
        <ThemeToggle className="text-on-surface-variant hover:bg-surface-container-low" />
      </header>

      <main className="pt-20 pb-10 px-5 max-w-lg mx-auto">
        <StepIndicator current={step} />

        {error && (
          <div className="bg-error-container border border-error-border text-error text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        {step === 1 && (
          <Step1InfoForm
            data={step1}
            onChange={setStep1}
            onContinue={handleContinueFromStep1}
          />
        )}

        {step === 2 && (
          <Step2Documents
            files={files}
            onChange={setFiles}
            onBack={handleBackFromStep2}
            onContinue={handleContinueFromStep2}
          />
        )}
        
        {step === 3 && (
          <Step3Grade
            data={step3}
            onChange={setStep3}
            onBack={handleBackFromStep3}
            onSubmit={handleFinalSubmit}
            submitting={submitting}
          />
        )}
      </main>
    </div>
  );
}