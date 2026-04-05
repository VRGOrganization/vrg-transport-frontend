// ─────────────────────────────────────────────────────────────
// types/auth.ts
// Tipos alinhados com o contrato da API refatorada (NestJS).
// O refresh_token NUNCA aparece aqui — vai direto para cookie HTTP-only.
// ─────────────────────────────────────────────────────────────
 
export type UserRole = "STUDENT" | "EMPLOYEE" | "ADMIN";
 
/** Usuário autenticado conforme retornado pelo backend */
export interface AuthUser {
  id: string;
  role: UserRole;
  identifier: string;
  name: string; // nome do student
}
 
/** Resposta de login, verify e refresh */
export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}
 
/** Resposta de register */
export interface RegisterResponse {
  message: string;
  isInstitutional: boolean;
}
 
/** Resposta de logout e resend-code */
export interface MessageResponse {
  message: string;
}
 
/** Erro tipado lançado pelo apiClient */
export interface ApiError {
  message: string;
  status: number;
}
 
/** Type guard para ApiError */
export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    "status" in err
  );
}