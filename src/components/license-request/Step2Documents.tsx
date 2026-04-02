"use client";

import { Button } from "@/components/ui/Button";
import DocumentUpload from "./DocumentUpload";
import { LICENSE_DOCUMENTS } from "@/constants/license-documents";
import { useState, useEffect, useMemo } from "react";

export type DocumentFiles = Record<string, File | null>;

interface Step2DocumentsProps {
  files: DocumentFiles;
  onChange: (files: DocumentFiles) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

// Componente de preview individual
function DocumentPreview({ file, onRemove, docName }: { 
  file: File; 
  onRemove: () => void;
  docName: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      setIsImage(true);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setIsImage(false);
      setPreviewUrl(null);
    }
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="relative group">
      <div className="bg-surface-container rounded-lg overflow-hidden border border-outline-variant hover:border-primary transition-all">
        <div className="relative aspect-video bg-surface-container-high flex items-center justify-center">
          {isImage && previewUrl ? (
            <img 
              src={previewUrl} 
              alt={`Preview ${docName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <p className="text-on-surface-variant text-sm capitalize">
                {file.type.split('/').pop() || 'documento'}
              </p>
            </div>
          )}
          
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-white text-xs font-medium uppercase">
              {file.type.split('/').pop()?.split('.').pop() || 'arquivo'}
            </span>
          </div>
          
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-error rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            aria-label="Remover documento"
          >
            <span className="material-symbols-outlined text-white text-sm">
              close
            </span>
          </button>
        </div>
        
        <div className="p-3 bg-surface-container">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {formatFileSize(file.size)}
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Enviado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de preview em grid
function DocumentsGrid({ files, onRemoveFile }: { 
  files: DocumentFiles; 
  onRemoveFile: (docType: string) => void;
}) {
  const uploadedDocs = Object.entries(files).filter(([, file]) => !!file);
  
  if (uploadedDocs.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-container-low rounded-lg border border-dashed border-outline-variant">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
          cloud_upload
        </span>
        <p className="text-on-surface-variant">
          Nenhum documento enviado ainda
        </p>
        <p className="text-on-surface-variant text-sm mt-1">
          Utilize os campos acima para fazer upload
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {uploadedDocs.map(([docType, file]) => {
        const docConfig = LICENSE_DOCUMENTS.find(d => d.photoType === docType);
        return (
          <DocumentPreview
            key={docType}
            file={file!}
            docName={docConfig?.label || docType}
            onRemove={() => onRemoveFile(docType)}
          />
        );
      })}
    </div>
  );
}

export default function Step2Documents({
  files,
  onChange,
  onBack,
  onSubmit,
  submitting,
}: Step2DocumentsProps) {
  const [showPreview, setShowPreview] = useState(true);

  const setFile = (photoType: string, file: File | null) => {
    onChange({ ...files, [photoType]: file });
  };

  const removeFile = (docType: string) => {
    // FIX: cria novo objeto com a chave explicitamente zerada para null,
    // garantindo que o React detecte a mudança de referência e re-renderize.
    const newFiles = { ...files, [docType]: null };
    onChange(newFiles);
  };

  // FIX 1 — usa Boolean (truthy) em vez de "!== null" para capturar
  //          tanto null quanto undefined após remoção.
  // FIX 2 — totalUploaded e o counter de obrigatórios usam a mesma
  //          lógica, e o header agora exibe X/3 (apenas obrigatórios).
  const { requiredFilled, requiredFilledCount, missingRequired, totalUploaded, totalRequired } = useMemo(() => {
    const requiredDocuments = LICENSE_DOCUMENTS.filter((d) => d.required);

    const requiredFilledCount = requiredDocuments.filter(
      (d) => Boolean(files[d.photoType])  // truthy: descarta null/undefined após remoção
    ).length;

    const requiredFilled = requiredFilledCount === requiredDocuments.length;
    const missingRequired = requiredDocuments.length - requiredFilledCount;

    // Conta apenas arquivos realmente presentes (truthy)
    const totalUploaded = Object.values(files).filter(Boolean).length;
    const totalRequired = requiredDocuments.length;

    return { requiredFilled, requiredFilledCount, missingRequired, totalUploaded, totalRequired };
  }, [files]);

  const getButtonText = () => {
    if (requiredFilled) return 'Finalizar pedido';
    if (missingRequired === 1) return `Falta 1 documento obrigatório`;
    return `Faltam ${missingRequired} documentos obrigatórios`;
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com progresso — FIX: exibe X/totalRequired (3/3) */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-on-surface">
            Documentos necessários
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            {requiredFilledCount} de {totalRequired} documentos obrigatórios enviados
          </p>
        </div>
        
        {totalUploaded > 0 && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-primary text-sm font-medium hover:underline"
          >
            {showPreview ? 'Ocultar preview' : 'Mostrar preview'}
          </button>
        )}
      </div>
      
      {/* Barra de progresso baseada nos obrigatórios */}
      <div className="space-y-2">
        <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(requiredFilledCount / totalRequired) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Uploads individuais */}
      <div className="space-y-4">
        {LICENSE_DOCUMENTS.map((doc) => (
          <DocumentUpload
            key={doc.photoType}
            config={doc}
            file={files[doc.photoType] ?? null}
            onChange={(file) => setFile(doc.photoType, file)}
          />
        ))}
      </div>

      {/* Grid de preview dos documentos */}
      {showPreview && (
        <DocumentsGrid files={files} onRemoveFile={removeFile} />
      )}

      {/* Legenda e ações */}
      <div className="space-y-4 pt-4 border-t border-outline-variant">
        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1">
            <span className="text-error font-bold">*</span>
            <span>Campos obrigatórios</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Documento enviado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Progresso</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="flex items-center gap-1 text-on-surface-variant font-semibold text-sm active:scale-95 transition-all disabled:opacity-50 px-4 py-2 rounded-lg hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            Voltar
          </button>

          <div className="flex-1 min-w-0">
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              disabled={!requiredFilled || submitting}
              icon="send"
              onClick={onSubmit}
              className="whitespace-normal break-words"
            >
              <span className="inline-block">
                {getButtonText()}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}