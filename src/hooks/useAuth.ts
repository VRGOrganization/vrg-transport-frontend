"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    // Verificar token no localStorage/sessionStorage
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          // Aqui será integrado com o backend real
          // Por enquanto, mock
          const mockUser = {
            id: "1",
            name: "Usuário Teste",
            email: "teste@instituicao.edu.br",
            role: "student" as const,
          };
          setUser(mockUser);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Integração com backend será adicionada aqui
      const mockUser = {
        id: "1",
        name: "Usuário Teste",
        email,
        role: "student" as const,
      };
      localStorage.setItem("auth_token", "mock_token");
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Falha na autenticação" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("auth_token");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, login, logout };
}