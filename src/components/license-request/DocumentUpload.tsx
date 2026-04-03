"use client";

import { useRef } from "react";
import { DocumentConfig } from "@/constants/license-documents";

interface DocumentUploadProps {
  config: DocumentConfig;
  file: File | null;
  onChange: (file: File | null) => void;
}

export default function DocumentUpload({ config, file, onChange }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] ?? null);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className="rounded-xl bg-surface-container-low"
      style={{ border: "1px solid var(--shadow-border)", overflow: "hidden" }}
    >
      <div
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          className="bg-surface-container-high rounded-full flex-shrink-0"
          style={{ padding: "10px" }}
        >
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: "22px", display: "block" }}
          >
            {config.icon}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <p className="font-headline font-bold text-on-surface" style={{ fontSize: "14px" }}>
              {config.label}
            </p>
            {config.required && (
              <span className="text-error text-xs font-bold">*</span>
            )}
          </div>
          <p className="text-on-surface-variant" style={{ fontSize: "12px" }}>
            {config.description}
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--shadow-border)",
          padding: "12px 16px",
        }}
      >
        {file ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              className="material-symbols-outlined text-success"
              style={{ fontSize: "20px" }}
            >
              check_circle
            </span>
            <span
              className="text-on-surface font-medium flex-1 truncate"
              style={{ fontSize: "13px" }}
            >
              {file.name}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                close
              </span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full text-primary font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{ padding: "4px 0" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              upload
            </span>
            Selecionar arquivo
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
