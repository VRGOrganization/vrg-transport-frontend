"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { verifyEmail } = useAuth();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError("Digite o código de 6 dígitos");
      return;
    }
    setLoading(true);
    try {
      const result = await verifyEmail(email, code);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error ?? "Código inválido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-headline text-2xl font-bold text-on-surface">
          Verifique seu e-mail
        </h2>
        <p className="text-on-surface-variant text-sm">
          Enviamos um código de 6 dígitos para{" "}
          <span className="font-semibold text-on-surface">{email}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Código de verificação"
          type="text"
          icon="pin"
          placeholder="000000"
          value={code}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
            setCode(val);
          }}
          error=""
        />

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          fullWidth
          loading={loading}
          icon="verified"
        >
          Verificar e-mail
        </Button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex-1 -mt-12 bg-surface rounded-t-[2.5rem] relative z-20 px-6 pt-8 pb-12 shadow-[0_-12px_40px_rgba(0,63,135,0.08)]">
      <div className="max-w-md mx-auto">
        <Suspense>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </main>
  );
}
