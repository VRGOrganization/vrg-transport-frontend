// ─────────────────────────────────────────────────────────────
// utils/validate3x4.ts
// Valida proporção 3x4 e aplica heurística leve de rosto centrado
// Sem IA pesada. Roda inteiramente no browser.
// ─────────────────────────────────────────────────────────────

import type { AspectRatioResult, FaceHeuristicResult } from "../types/imageValidation";

// ─── Constantes de proporção ──────────────────────────────────
/** Proporção real de uma foto 3x4: 3/4 = 0.75 */
const IDEAL_RATIO = 3 / 4; // 0.75

/**
 * Tolerância aceita em relação ao ideal.
 * Margem de ±0.08 → aceita de ~0.67 até ~0.83
 * Cobre variações de scanner, câmera e crop manual.
 */
const RATIO_TOLERANCE = 0.08;

/** Proporção mínima aceita */
export const RATIO_MIN = IDEAL_RATIO - RATIO_TOLERANCE; // ~0.67
/** Proporção máxima aceita */
export const RATIO_MAX = IDEAL_RATIO + RATIO_TOLERANCE; // ~0.83

// ─── Constantes da heurística de rosto ───────────────────────
/**
 * Região central analisada (fração da dimensão total).
 * 0.4 = 40% central em cada eixo → janela de 40%×40%.
 */
const CENTER_REGION = 0.4;

/**
 * Variância mínima de luminância na região central para
 * considerarmos que há "algo interessante" (rosto, documento, etc.)
 * Imagens em branco/preto puro ficam abaixo desse limiar.
 */
const MIN_VARIANCE = 200;

// ─── Validação de proporção ───────────────────────────────────

/**
 * Verifica se a proporção width/height da imagem é compatível com 3x4.
 */
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
      message: `Imagem muito alta para formato 3x4 (proporção ${ratio.toFixed(2)}). Use uma foto vertical.`,
    };
  }

  return {
    ratio,
    valid: false,
    message: `Imagem muito larga para formato 3x4 (proporção ${ratio.toFixed(2)}). Recorte a foto.`,
  };
}

// ─── Heurística de rosto centralizado ────────────────────────

/**
 * Analisa a região central do canvas buscando variância de luminância.
 *
 * LÓGICA:
 * Uma foto de rosto em fundo claro tem alto contraste na zona central.
 * Uma imagem em branco, overexposed ou com fundo predominante
 * terá baixa variância → provavelmente não é uma foto de rosto.
 *
 * Limitações conhecidas (aceitas por design):
 * - Não detecta faces reais (sem modelo)
 * - Pode ter falso positivo em imagens coloridas não-retrato
 * - Pode ter falso negativo em fotos de baixo contraste
 *
 * Para o contexto de carteirinha estudantil, essa heurística é suficiente
 * pois o backend fará validação mais robusta com modelo de detecção de faces.
 */
export function analyzeFaceHeuristic(
  canvas: HTMLCanvasElement
): FaceHeuristicResult {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { likelyCentered: true }; // fail-open: não bloqueia por falta de contexto
  }

  const { width, height } = canvas;

  // Define a janela central
  const regionW = Math.floor(width * CENTER_REGION);
  const regionH = Math.floor(height * CENTER_REGION);
  const startX = Math.floor((width - regionW) / 2);
  const startY = Math.floor((height - regionH) / 2);

  // Lê pixels da região central
  let imageData: ImageData;
  try {
    imageData = ctx.getImageData(startX, startY, regionW, regionH);
  } catch {
    return { likelyCentered: true }; // fail-open em caso de erro CORS ou similar
  }

  const { data } = imageData;
  const pixelCount = regionW * regionH;

  if (pixelCount === 0) {
    return { likelyCentered: true };
  }

  // Calcula luminância média (fórmula ITU-R BT.601)
  let sumLuma = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    sumLuma += 0.299 * r + 0.587 * g + 0.114 * b;
  }
  const meanLuma = sumLuma / pixelCount;

  // Calcula variância
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
      : "A região central da imagem parece vazia ou sem contraste. Certifique-se de que o rosto está centralizado.",
  };
}