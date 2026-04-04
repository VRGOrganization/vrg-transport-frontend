"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export default function DocumentUpload({ 
  config, 
  entry, 
  onFileSelect, 
  onRemove, 
  disabled, 
  acceptPdf 
}: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const status = entry?.result?.status ?? "idle";
  const isPdf = entry?.file?.type === "application/pdf";
  const isProcessing = status === "processing";

  return (
    <div className={cn(
      "rounded-xl border transition-all duration-200 overflow-hidden",
      status === "ok" ? "border-success bg-success/5" : "border-outline-variant bg-surface",
      status === "error" && "border-error bg-error/5"
    )}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-surface-container-high p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>
              {config.icon}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              {config.label} {config.required && <span className="text-error">*</span>}
            </p>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              {config.description}
            </p>
          </div>
        </div>
        
        {status === "ok" && (
          <span className="material-symbols-outlined text-success">check_circle</span>
        )}
      </div>

      {entry ? (
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-3 p-2 bg-surface-container-low rounded-lg border border-outline-variant">
            {/* Thumbnail */}
            <div className="h-12 w-12 shrink-0 flex items-center justify-center bg-surface-container-high rounded border overflow-hidden">
              {isProcessing ? (
                <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
              ) : isPdf ? (
                <span className="material-symbols-outlined text-error">picture_as_pdf</span>
              ) : (
                <img src={entry.previewUrl} alt="Preview" className="h-full w-full object-cover" />
              )}
            </div>

            {/* Info do Arquivo */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-on-surface">{entry.file.name}</p>
              <div className="flex gap-3 mt-1">
                <button 
                  type="button" 
                  onClick={() => inputRef.current?.click()} 
                  className="text-[11px] text-primary font-bold hover:underline"
                >
                  Alterar
                </button>
                <button 
                  type="button" 
                  onClick={onRemove} 
                  className="text-[11px] text-error font-bold hover:underline"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>

          {/* Mensagens de Erro/Alerta */}
          {entry.result?.message && !isProcessing && (
            <div className={cn(
              "mt-2 p-2 rounded text-[10px] flex gap-2 items-start",
              status === "error" ? "bg-error/10 text-error" : "bg-warning/10 text-on-warning"
            )}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {status === "error" ? "report" : "warning"}
              </span>
              <span>{entry.result.message}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="w-full py-3 border-2 border-dashed border-outline-variant rounded-xl text-xs font-bold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_a_photo</span>
            Selecionar {acceptPdf ? "Documento (Img ou PDF)" : "Foto 3x4"}
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptPdf ? "image/jpeg,image/png,application/pdf" : "image/jpeg,image/png"}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}