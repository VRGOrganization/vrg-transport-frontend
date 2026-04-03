"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, setTokens, clearTokens } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "servant" | "admin";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const data = await api.get<User>("/student/me");
        setUser(data);
      } catch {
        clearTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post<{
        access_token: string;
        refresh_token: string;
        user: { id: string; role: string; identifier: string };
      }>("/auth/student/login", { email, password });

      setTokens(data.access_token, data.refresh_token);

      const me = await api.get<User>("/student/me");
      setUser(me);
      return { success: true };
    } catch (err: unknown) {
      const error = err as { message?: string };
      return { success: false, error: error?.message ?? "Credenciais inválidas" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    telephone: string;
  }) => {
    try {
      await api.post("/auth/student/register", data);
      return { success: true };
    } catch (err: unknown) {
      const error = err as { message?: string };
      return { success: false, error: error?.message ?? "Erro ao criar conta" };
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const data = await api.post<{
        access_token: string;
        refresh_token: string;
      }>("/auth/student/verify", { email, code });

      setTokens(data.access_token, data.refresh_token);

      const me = await api.get<User>("/student/me");
      setUser(me);
      return { success: true };
    } catch (err: unknown) {
      const error = err as { message?: string };
      return { success: false, error: error?.message ?? "Código inválido" };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // ignora erro de logout
    } finally {
      clearTokens();
      setUser(null);
      router.push("/login");
    }
  };

  return { user, loading, login, register, verifyEmail, logout };
}
