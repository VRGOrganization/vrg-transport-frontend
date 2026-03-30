"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Login attempt:", formData);
      router.push("/dashboard/student");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ ...errors, password: "Credenciais inválidas" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10">
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
          Bem-vindo de volta
        </h3>
        <p className="text-on-surface-variant">
          Acesse o portal de transporte institucional
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="font-label text-sm font-medium text-on-surface-variant ml-1">
            Email Institucional
          </label>
          <Input
            type="email"
            icon="mail"
            placeholder="nome@instituicao.edu.br"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="font-label text-sm font-medium text-on-surface-variant">
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            type="password"
            icon="lock"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
        </div>
        
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="remember"
            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-low"
            checked={formData.remember}
            onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
          />
          <label htmlFor="remember" className="text-sm text-on-surface-variant select-none">
            Lembrar acesso neste dispositivo
          </label>
        </div>
        
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={loading}
          icon="arrow_forward"
          className="mt-4"
        >
          Entrar no Sistema
        </Button>
      </form>
      
      <div className="mt-10 pt-8 border-t border-surface-container-high text-center">
        <p className="text-on-surface-variant text-sm">
          Ainda não tem acesso?
          <Link href="/register" className="text-primary font-bold hover:underline ml-1">
            Registrar-se
          </Link>
        </p>
      </div>
    </>
  );
}