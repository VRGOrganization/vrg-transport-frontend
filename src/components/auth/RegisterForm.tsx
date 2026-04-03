"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Nome é obrigatório";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (!formData.telephone) {
      newErrors.telephone = "Telefone é obrigatório";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter no mínimo 8 caracteres";
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Senha deve ter maiúscula, minúscula e número";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
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
      const result = await register({
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
      });

      if (result.success) {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        setErrors((prev) => ({ ...prev, general: result.error ?? "Erro ao criar conta" }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-2">
          Criar nova conta
        </h3>
        <p className="text-on-surface-variant text-sm">
          Preencha os dados abaixo para se cadastrar
        </p>
      </div>

      {errors.general && (
        <div className="bg-error-container border border-error-border text-error text-sm rounded-xl px-4 py-3 mb-4">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome Completo"
          type="text"
          icon="person"
          placeholder="Seu nome completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          icon="mail"
          placeholder="nome@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <Input
          label="Telefone"
          type="tel"
          icon="phone"
          placeholder="(22) 99999-9999"
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          error={errors.telephone}
        />

        <Input
          label="Senha"
          type="password"
          icon="lock"
          placeholder="Mín. 8 caracteres, maiúscula e número"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />

        <Input
          label="Confirmar Senha"
          type="password"
          icon="lock"
          placeholder="Digite a senha novamente"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          icon="app_registration"
          className="mt-4"
        >
          Criar Conta
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-surface-container-high text-center">
        <p className="text-on-surface-variant text-sm">
          Já possui uma conta?
          <Link href="/login" className="text-primary font-bold hover:underline ml-1">
            Fazer login
          </Link>
        </p>
      </div>
    </>
  );
}
