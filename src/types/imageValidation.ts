// ─────────────────────────────────────────────────────────────
// types/imageValidation.ts
// Tipos centrais do pipeline de validação de imagens
// ─────────────────────────────────────────────────────────────

/** Status individual de cada imagem no pipeline */
export type ImageValidationStatus =
  | "idle"        // ainda não foi selecionada / slot vazio
  | "pending"     // arquivo escolhido, aguardando processamento
  | "processing"  // pipeline rodando agora
  | "ok"          // passou em todas as validações
  | "warning"     // suspeita (NSFW leve) — bloqueado para envio
  | "error";      // reprovado (NSFW grave, proporção errada, etc.)

/** Resultado das checagens NSFW */
export interface NSFWResult {
  porn: number;
  hentai: number;
  sexy: number;
  neutral: number;
  drawing: number;
}

/** Resultado da validação de proporção 3x4 */
export interface AspectRatioResult {
  ratio: number;      // width / height
  valid: boolean;
  message?: string;
}

/** Resultado da heurística de rosto centralizado */
export interface FaceHeuristicResult {
  /** true se a região central tem contraste/variância suficiente */
  likelyCentered: boolean;
  message?: string;
}

/** Resultado completo de uma imagem processada */
export interface ImageValidationResult {
  status: ImageValidationStatus;
  /** Blob redimensionado — usado para envio (sem base64) */
  processedBlob: Blob | null;
  nsfw: NSFWResult | null;
  aspectRatio: AspectRatioResult | null;
  faceHeuristic: FaceHeuristicResult | null;
  /** Mensagem de erro/aviso principal para exibir na UI */
  message: string;
}

/** Entrada do pipeline de processamento */
export interface ImageProcessorInput {
  file: File;
  /** Largura máxima para resize (px). Default vem do hook baseado no UA. */
  targetSize?: number;
}