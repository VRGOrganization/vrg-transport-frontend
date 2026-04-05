// ─────────────────────────────────────────────────────────────
// hooks/useApi.ts
// Hook genérico para disparar requests via apiClient com controle
// de estado: loading, data e error.
//
// Uso:
//   const { execute, data, loading, error } = useApi(apiClient.get)
//   await execute('/alguma-rota')
// ─────────────────────────────────────────────────────────────

"use client";

import { useCallback, useState } from "react";
import type { ApiError } from "@/types/auth";
import { isApiError } from "@/types/auth";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<TArgs extends unknown[], TData> extends UseApiState<TData> {
  execute: (...args: TArgs) => Promise<TData | null>;
  reset: () => void;
}

export function useApi<TArgs extends unknown[], TData>(
  fn: (...args: TArgs) => Promise<TData>
): UseApiReturn<TArgs, TData> {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<TData | null> => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await fn(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err: unknown) {
        const apiErr: ApiError = isApiError(err)
          ? err
          : { message: "Erro inesperado", status: 0 };
        setState({ data: null, loading: false, error: apiErr });
        return null;
      }
    },
    [fn]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}