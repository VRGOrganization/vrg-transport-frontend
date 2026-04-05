// ─────────────────────────────────────────────────────────────
// utils/validate3x4.ts
// Valida proporção e aplica heurística de rosto centrado.
// Versão flexibilizada para aceitar fotos de smartphones e fundos claros.
// ─────────────────────────────────────────────────────────────

import type { AspectRatioResult, FaceHeuristicResult } from "../types/imageValidation";

// ─── Constantes de proporção ──────────────────────────────────
/** Proporção ideal de uma foto 3x4: 0.75 */
const IDEAL_RATIO = 3 / 4; 

/**
 * Tolerância aumentada para 0.12 (antes 0.08).
 * Aceita de ~0.63 (fotos 2:3 comuns em iPhones/Androids) até ~0.87.
 */
const RATIO_TOLERANCE = 0.12;

export const RATIO_MIN = IDEAL_RATIO - RATIO_TOLERANCE; 
export const RATIO_MAX = IDEAL_RATIO + RATIO_TOLERANCE; 

// ─── Constantes da heurística de rosto ───────────────────────
/**
 * Janela central aumentada para 50% para focar mais nos elementos 
 * do rosto e menos nas bordas do fundo.
 */
const CENTER_REGION = 0.5;

/**
 * Variância mínima reduzida para 100 (antes 200).
 * Evita que fotos com fundo branco ou luz uniforme sejam reprovadas.
 */
const MIN_VARIANCE = 100;

// ─── Validação de proporção ───────────────────────────────────

export function validate3x4Ratio(
  width: number,
  height: number
): AspectRatioResult {
  if (height === 0) {
    return { ratio: 0, valid: false, message: "Imagem inválida (altura zero)." };
  }

  const ratio = width / height;
  const valid = ratio >= RATIO_MIN && ratio <= RATIO_MAX;

  if (valid) {
    return { ratio, valid };
  }

  if (ratio < RATIO_MIN) {
    return {
      ratio,
      valid: false,
      message: `A foto está muito estreita (proporção ${ratio.toFixed(2)}). Tente enquadrar o busto verticalmente.`,
    };
  }

  return {
    ratio,
    valid: false,
    message: `A foto está muito larga (proporção ${ratio.toFixed(2)}). Tente um corte mais vertical.`,
  };
}

// ─── Heurística de rosto centralizado ────────────────────────

export function analyzeFaceHeuristic(
  canvas: HTMLCanvasElement
): FaceHeuristicResult {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { likelyCentered: true };
  }

  const { width, height } = canvas;

  const regionW = Math.floor(width * CENTER_REGION);
  const regionH = Math.floor(height * CENTER_REGION);
  const startX = Math.floor((width - regionW) / 2);
  const startY = Math.floor((height - regionH) / 2);

  let imageData: ImageData;
  try {
    imageData = ctx.getImageData(startX, startY, regionW, regionH);
  } catch {
    return { likelyCentered: true }; 
  }

  const { data } = imageData;
  const pixelCount = regionW * regionH;

  if (pixelCount === 0) {
    return { likelyCentered: true };
  }

  let sumLuma = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    sumLuma += 0.299 * r + 0.587 * g + 0.114 * b;
  }
  const meanLuma = sumLuma / pixelCount;

  let sumVariance = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    const diff = luma - meanLuma;
    sumVariance += diff * diff;
  }
  const variance = sumVariance / pixelCount;

  const likelyCentered = variance >= MIN_VARIANCE;

  return {
    likelyCentered,
    message: likelyCentered
      ? undefined
      : "O enquadramento central parece pouco nítido. Centralize bem o rosto na foto.",
  };
}