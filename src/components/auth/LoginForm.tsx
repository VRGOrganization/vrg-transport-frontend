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
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ ...errors, password: "Credenciais inválidas" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">


      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
            Email Institucional
          </label>
          <Input
            type="email"
            icon="alternate_email"
            placeholder="nome@instituicao.edu.br"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
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

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={loading}
          icon="arrow_forward"
        >
          Entrar no Sistema
        </Button>
      </form>

      {/* Link de registro */}
      <div className="text-center pt-2">
        <p className="text-on-surface-variant text-sm">
          Ainda não possui acesso?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Registrar-se
          </Link>
        </p>
      </div>

      {/* Cards de suporte e rotas */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">help_outline</span>
          <span className="text-xs font-bold leading-tight text-on-surface">Suporte ao Usuário</span>
        </div>
        <div className="bg-primary/5 p-4 rounded-2xl flex flex-col gap-3 border border-primary/10">
          <span className="material-symbols-outlined text-primary text-2xl">map</span>
          <span className="text-xs font-bold leading-tight text-on-surface">Ver Rotas Ativas</span>
        </div>
      </div>
    </div>
  );
}