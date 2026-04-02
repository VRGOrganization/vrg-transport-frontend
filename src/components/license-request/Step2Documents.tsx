"use client";

import { Button } from "@/components/ui/Button";
import DocumentUpload from "./DocumentUpload";
import { LICENSE_DOCUMENTS } from "@/constants/license-documents";

export type DocumentFiles = Record<string, File | null>;

interface Step2DocumentsProps {
  files: DocumentFiles;
  onChange: (files: DocumentFiles) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function Step2Documents({
  files,
  onChange,
  onBack,
  onSubmit,
  submitting,
}: Step2DocumentsProps) {
  const setFile = (photoType: string, file: File | null) =>
    onChange({ ...files, [photoType]: file });

  const requiredFilled = LICENSE_DOCUMENTS.filter((d) => d.required).every(
    (d) => files[d.photoType] !== null && files[d.photoType] !== undefined
  );

  return (
    <div className="space-y-4">
      {LICENSE_DOCUMENTS.map((doc) => (
        <DocumentUpload
          key={doc.photoType}
          config={doc}
          file={files[doc.photoType] ?? null}
          onChange={(file) => setFile(doc.photoType, file)}
        />
      ))}

      <p className="text-on-surface-variant text-xs ml-1">
        <span className="text-error font-bold">*</span> Campos obrigatórios
      </p>

      <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex items-center gap-1 text-on-surface-variant font-semibold text-sm active:scale-95 transition-all disabled:opacity-50"
          style={{ padding: "4px 0", flexShrink: 0 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            arrow_back
          </span>
          Voltar
        </button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          loading={submitting}
          disabled={!requiredFilled || submitting}
          icon="send"
          onClick={onSubmit}
        >
          Finalizar pedido
        </Button>
      </div>
    </div>
  );
}
