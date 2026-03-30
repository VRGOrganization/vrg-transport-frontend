"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    registrationNumber: "",
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

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    if (!formData.registrationNumber) {
      newErrors.registrationNumber = "Matrícula é obrigatória";
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
      console.log("Register attempt:", formData);
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10">
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
          Criar nova conta
        </h3>
        <p className="text-on-surface-variant">
          Preencha os dados abaixo para se cadastrar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="font-label text-sm font-medium text-on-surface-variant ml-1">
            Nome Completo
          </label>
          <Input
            type="text"
            icon="person"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />
        </div>
        
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
          <label className="font-label text-sm font-medium text-on-surface-variant ml-1">
            Número de Matrícula
          </label>
          <Input
            type="text"
            icon="badge"
            placeholder="2024001234"
            value={formData.registrationNumber}
            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
            error={errors.registrationNumber}
          />
        </div>
        
        <div className="space-y-2">
          <label className="font-label text-sm font-medium text-on-surface-variant ml-1">
            Senha
          </label>
          <Input
            type="password"
            icon="lock"
            placeholder="Crie uma senha forte"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
        </div>
        
        <div className="space-y-2">
          <label className="font-label text-sm font-medium text-on-surface-variant ml-1">
            Confirmar Senha
          </label>
          <Input
            type="password"
            icon="lock"
            placeholder="Digite a senha novamente"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />
        </div>
        
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
      
      <div className="mt-10 pt-8 border-t border-surface-container-high text-center">
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