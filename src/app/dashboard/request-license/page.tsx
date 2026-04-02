"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import StepIndicator from "@/components/license-request/StepIndicator";
import Step1InfoForm, { Step1Data } from "@/components/license-request/Step1InfoForm";
import Step2Documents, { DocumentFiles } from "@/components/license-request/Step2Documents";
import { LICENSE_DOCUMENTS } from "@/constants/license-documents";

const STORAGE_KEY = "license_request_step1";

const EMPTY_STEP1: Step1Data = {
  institution: "",
  degree: "",
  shift: "",
  bloodType: "",
  bus: "",
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
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<Step1Data>(EMPTY_STEP1);
  const [files, setFiles] = useState<DocumentFiles>(
    Object.fromEntries(LICENSE_DOCUMENTS.map((d) => [d.photoType, null]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStep1(JSON.parse(saved));
      } catch {
        // ignora JSON inválido
      }
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(step1));
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      await api.patch("/student/me", {
        institution: step1.institution,
        degree: step1.degree,
        shift: step1.shift,
        bloodType: step1.bloodType,
        bus: step1.bus,
      });

      for (const doc of LICENSE_DOCUMENTS) {
        const file = files[doc.photoType];
        if (!file) continue;

        const base64 = await fileToBase64(file);
        await api.post("/image/me", {
          photoType: doc.photoType,
          photo3x4: base64,
        });
      }

      localStorage.removeItem(STORAGE_KEY);
      router.push("/dashboard?requested=true");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message ?? "Erro ao enviar pedido. Tente novamente.");
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
            onContinue={handleContinue}
          />
        )}

        {step === 2 && (
          <Step2Documents
            files={files}
            onChange={setFiles}
            onBack={handleBack}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </main>
    </div>
  );
}
