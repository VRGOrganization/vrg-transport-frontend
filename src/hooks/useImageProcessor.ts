"use client";

import { useState, useCallback } from "react";
import type { ImageValidationResult, ImageValidationStatus } from "@/types/imageValidation";
import { preprocessImage, getTargetSize } from "@/utils/preprocessImage";
import { validate3x4Ratio, analyzeFaceHeuristic } from "@/utils/validate3x4";
import { analyzeNSFW, interpretNSFW } from "@/utils/analyzeNSFW";
import type { NSFWModel } from "@/utils/analyzeNSFW";

export interface ImageEntry {
  file: File;
  previewUrl: string;
  result: ImageValidationResult | null;
}

export interface ImageProcessorState {
  entries: (ImageEntry | null)[];
  isProcessing: boolean;
  allValid: boolean;
  setFile: (index: number, file: File, shouldValidateRatio: boolean) => void;
  removeEntry: (index: number) => void;
}

async function runPipeline(
  file: File,
  model: NSFWModel | null,
  shouldValidateRatio: boolean
): Promise<ImageValidationResult> {
  
  // 1. SUPORTE A PDF: Se for PDF, ignora validações de imagem
  if (file.type === "application/pdf") {
    return {
      status: "ok",
      processedBlob: file,
      nsfw: null,
      aspectRatio: null,
      faceHeuristic: null,
      message: "",
    };
  }

  // 2. PROCESSAMENTO DE IMAGEM
  const targetSize = getTargetSize();
  let preprocessed;
  
  try {
    preprocessed = await preprocessImage(file, { targetSize });
  } catch {
    return { 
      status: "error", processedBlob: null, nsfw: null, 
      aspectRatio: null, faceHeuristic: null, 
      message: "Erro ao processar imagem." 
    };
  }

  const { blob, canvas, width, height } = preprocessed;
  
  // Validação 3x4 e Rosto (Apenas se for Selfie/shouldValidateRatio)
  const aspectRatio = shouldValidateRatio 
    ? validate3x4Ratio(width, height)
    : { valid: true, ratio: width/height, message: "" };

  const faceHeuristic = shouldValidateRatio
    ? analyzeFaceHeuristic(canvas)
    : { likelyCentered: true, message: "" };

  let nsfw: any = null;
  let nsfwMessage = "";

  if (model) {
    try {
      nsfw = await analyzeNSFW(model, canvas);
      const { decision, message } = interpretNSFW(nsfw);
      if (decision === "block") {
        return { status: "error", processedBlob: null, nsfw, aspectRatio, faceHeuristic, message: message || "Conteúdo impróprio." };
      }
      if (decision === "warn") nsfwMessage = message || "";
    } catch { nsfwMessage = ""; }
  }

  const errors: string[] = [];
  // CORREÇÃO DO ERRO TS2345: Usando operador OR para garantir string
  if (!aspectRatio.valid) errors.push(aspectRatio.message || "Proporção inválida.");
  if (!faceHeuristic.likelyCentered) errors.push(faceHeuristic.message || "Rosto não identificado.");

  const finalErrorMessage = errors.filter(Boolean).join(" ");

  if (finalErrorMessage) {
    return { 
      status: "error", 
      processedBlob: blob, 
      nsfw, 
      aspectRatio, 
      faceHeuristic, 
      message: finalErrorMessage 
    };
  }

  return {
    status: nsfwMessage ? "warning" : "ok",
    processedBlob: blob,
    nsfw,
    aspectRatio,
    faceHeuristic,
    message: nsfwMessage,
  };
}

export function useImageProcessor(
  model: NSFWModel | null,
  slotsCount: number = 5
): ImageProcessorState {
  const [entries, setEntries] = useState<(ImageEntry | null)[]>(new Array(slotsCount).fill(null));
  const [processingCount, setProcessingCount] = useState(0);

  const processEntry = useCallback(
    async (index: number, entry: ImageEntry, shouldValidateRatio: boolean) => {
      setProcessingCount((c) => c + 1);
      setEntries((prev) => {
        const next = [...prev];
        next[index] = { ...entry, result: { status: "processing", processedBlob: null, nsfw: null, aspectRatio: null, faceHeuristic: null, message: "Analisando..." } };
        return next;
      });

      const result = await runPipeline(entry.file, model, shouldValidateRatio);

      setEntries((prev) => {
        if (prev[index]?.file === entry.file) {
          const next = [...prev];
          next[index] = { ...prev[index]!, result };
          return next;
        }
        return prev;
      });
      setProcessingCount((c) => c - 1);
    },
    [model]
  );

  const setFile = useCallback(
    (index: number, file: File, shouldValidateRatio: boolean) => {
      const isPdf = file.type === "application/pdf";
      const newEntry: ImageEntry = {
        file,
        previewUrl: isPdf ? "" : URL.createObjectURL(file),
        result: null
      };

      setEntries((prev) => {
        const next = [...prev];
        if (next[index]?.previewUrl) URL.revokeObjectURL(next[index]!.previewUrl);
        next[index] = newEntry;
        return next;
      });

      processEntry(index, newEntry, shouldValidateRatio);
    },
    [processEntry]
  );

  const removeEntry = useCallback((index: number) => {
    setEntries((prev) => {
      const next = [...prev];
      if (next[index]?.previewUrl) URL.revokeObjectURL(next[index]!.previewUrl);
      next[index] = null;
      return next;
    });
  }, []);

  const activeEntries = entries.filter(e => e !== null);
  const allValid = activeEntries.length > 0 && activeEntries.every(e => e?.result?.status === "ok");

  return { entries, isProcessing: processingCount > 0, allValid, setFile, removeEntry };
}