"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { api } from "@/lib/api";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import StepIndicator from "@/components/license-request/StepIndicator";
import Step1InfoForm, {
  Step1Data,
} from "@/components/license-request/Step1InfoForm";
import Step3Grade, {
  Step3Data,
} from "@/components/license-request/Step3grade";

import { LICENSE_DOCUMENTS } from "@/constants/license-documents";

// ✅ IMPORT SOMENTE DE TIPO (não entra no bundle)
import type { DocumentEntries } from "@/components/license-request/Step2Documents";

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

// ✅ LAZY LOAD REAL (resolve o problema do TensorFlow)
const Step2Documents = dynamic(
  () => import("@/components/license-request/Step2Documents"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-surface-container-low border border-outline-variant/30"
          />
        ))}
      </div>
    ),
  }
);

function makeEmptyEntries(): DocumentEntries {
  return Object.fromEntries(
    LICENSE_DOCUMENTS.map((d) => [d.photoType, null])
  );
}

export default function RequestLicensePage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1, setStep1] = useState<Step1Data>(EMPTY_STEP1);
  const [step3, setStep3] = useState<Step3Data>(EMPTY_STEP3);
  const [documentEntries, setDocumentEntries] =
    useState<DocumentEntries>(makeEmptyEntries());

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedStep1 = localStorage.getItem(STORAGE_KEY);
    if (savedStep1) {
      try {
        setStep1(JSON.parse(savedStep1));
      } catch {}
    }

    const savedStep3 = localStorage.getItem(STORAGE_KEY_STEP3);
    if (savedStep3) {
      try {
        setStep3(JSON.parse(savedStep3));
      } catch {}
    }
  }, []);

  const handleContinueFromStep1 = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(step1));
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackFromStep2 = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinueFromStep2 = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(step1));
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackFromStep3 = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      localStorage.setItem(STORAGE_KEY_STEP3, JSON.stringify(step3));

      // 1. Dados acadêmicos
      await api.patch("/student/me", {
        institution: step1.institution,
        degree: step1.degree,
        shift: step1.shift,
        bloodType: step1.bloodType,
        bus: step1.bus,
      });

      // 2. Documentos
      for (const doc of LICENSE_DOCUMENTS) {
        const entry = documentEntries[doc.photoType];

        const blob = entry?.result?.processedBlob ?? entry?.file;
        if (!blob) continue;

        const formData = new FormData();
        formData.append("photoType", doc.photoType);
        formData.append(
          "photo",
          blob,
          entry?.file?.name ?? `${doc.photoType}.jpg`
        );

        await api.postForm("/image/me", formData);
      }

      // 3. Grade
      await api.post("/student/schedule", {
        selections: step3.selections,
      });

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_STEP3);

      router.push("/dashboard?requested=true");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message ?? "Erro ao enviar pedido. Tente novamente.");
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
          <ArrowLeft size={20} className="text-on-surface" />
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
            <AlertCircle size={16} />
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
            entries={documentEntries}
            onChange={setDocumentEntries}
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