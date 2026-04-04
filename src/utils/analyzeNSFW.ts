// ─────────────────────────────────────────────────────────────
// utils/analyzeNSFW.ts
// Analisa uma imagem com nsfwjs e retorna resultado tipado.
// O modelo deve ser passado como argumento (gerenciado pelo hook).
// ─────────────────────────────────────────────────────────────

import type { NSFWResult } from "../types/imageValidation";

// nsfwjs usa types próprios — declaração mínima para evitar erro de import
// sem instalar @types/nsfwjs (que não existe)
interface NSFWPrediction {
  className: string;
  probability: number;
}

export interface NSFWModel {
  classify(
    input: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement,
    topk?: number
  ): Promise<NSFWPrediction[]>;
}

// ─── Thresholds de decisão ────────────────────────────────────

/** Bloqueia envio imediatamente */
export const NSFW_BLOCK_THRESHOLDS = {
  Porn: 0.6,
  Hentai: 0.6,
} as const;

/** Marca como suspeito (warning) */
export const NSFW_WARN_THRESHOLDS = {
  Porn: 0.2,
  Hentai: 0.2,
  Sexy: 0.4,
} as const;

// ─── Análise ──────────────────────────────────────────────────

/**
 * Roda a classificação NSFW no canvas fornecido.
 * Retorna as probabilidades normalizadas por categoria.
 */
export async function analyzeNSFW(
  model: NSFWModel,
  canvas: HTMLCanvasElement
): Promise<NSFWResult> {
  const predictions = await model.classify(canvas);

  // Mapeia array de predições para objeto tipado
  const result: NSFWResult = {
    porn: 0,
    hentai: 0,
    sexy: 0,
    neutral: 0,
    drawing: 0,
  };

  for (const pred of predictions) {
    switch (pred.className) {
      case "Porn":
        result.porn = pred.probability;
        break;
      case "Hentai":
        result.hentai = pred.probability;
        break;
      case "Sexy":
        result.sexy = pred.probability;
        break;
      case "Neutral":
        result.neutral = pred.probability;
        break;
      case "Drawing":
        result.drawing = pred.probability;
        break;
    }
  }

  return result;
}

// ─── Interpretação do resultado ───────────────────────────────

export type NSFWDecision = "block" | "warn" | "ok";

/**
 * Interpreta o NSFWResult e retorna uma decisão + mensagem de usuário.
 */
export function interpretNSFW(nsfw: NSFWResult): {
  decision: NSFWDecision;
  message: string;
} {
  // Verifica bloqueio imediato
  if (nsfw.porn >= NSFW_BLOCK_THRESHOLDS.Porn) {
    return {
      decision: "block",
      message: "Imagem bloqueada: conteúdo adulto detectado.",
    };
  }
  if (nsfw.hentai >= NSFW_BLOCK_THRESHOLDS.Hentai) {
    return {
      decision: "block",
      message: "Imagem bloqueada: conteúdo inadequado detectado.",
    };
  }

  // Verifica aviso
  if (
    nsfw.porn >= NSFW_WARN_THRESHOLDS.Porn ||
    nsfw.hentai >= NSFW_WARN_THRESHOLDS.Hentai ||
    nsfw.sexy >= NSFW_WARN_THRESHOLDS.Sexy
  ) {
    return {
      decision: "warn",
      message:
        "Imagem suspeita: pode conter conteúdo inadequado. Revise antes de enviar.",
    };
  }

  return { decision: "ok", message: "" };
}