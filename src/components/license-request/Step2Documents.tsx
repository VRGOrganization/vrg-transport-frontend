"use client";

import { useEffect, useCallback } from "react";
import { Button } from "../../components/ui/Button";
import DocumentUpload from "./DocumentUpload";
import { LICENSE_DOCUMENTS } from "@/constants/license-documents";
import { useNSFW } from "../../hooks/useNSFW";
import { useImageProcessor } from "../../hooks/useImageProcessor";
import { cn } from "../../lib/utils";

export default function Step2Documents({ entries, onChange, onBack, onContinue }: any) {
  const nsfw = useNSFW();
  const model = nsfw.status === "ready" ? nsfw.model : null;

  const {
    entries: processorEntries,
    isProcessing,
    allValid,
    setFile,
    removeEntry,
  } = useImageProcessor(model, LICENSE_DOCUMENTS.length);

  useEffect(() => {
    const mapped = Object.fromEntries(
      LICENSE_DOCUMENTS.map((doc, i) => [doc.photoType, processorEntries[i] ?? null])
    );
    onChange(mapped);
  }, [processorEntries, onChange]);

  const handleFileSelect = useCallback(
    (index: number, file: File, photoType: string) => {
      const isSelfie = photoType === "selfie";
      
      if (isSelfie && file.type === "application/pdf") {
        alert("A selfie precisa ser uma imagem (JPG ou PNG).");
        return;
      }

      setFile(index, file, isSelfie);
    },
    [setFile]
  );

  const okCount = processorEntries.filter(e => e?.result?.status === "ok").length;
  const totalRequired = LICENSE_DOCUMENTS.filter(d => d.required).length;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {LICENSE_DOCUMENTS.map((doc, index) => (
          <DocumentUpload
            key={doc.photoType}
            config={doc}
            entry={processorEntries[index] ?? null}
            acceptPdf={doc.photoType !== "selfie"} 
            onFileSelect={(file: File) => handleFileSelect(index, file, doc.photoType)}
            onRemove={() => removeEntry(index)}
            disabled={isProcessing}
          />
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-outline-variant">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-all"
        >
          Voltar
        </button>
        <Button
          variant="primary"
          fullWidth
          disabled={!allValid || isProcessing}
          onClick={onContinue}
        >
          {allValid ? "Continuar" : `Aguardando documentos (${okCount}/${totalRequired})`}
        </Button>
      </div>
    </div>
  );
}