"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AuthHeader() {
  return (
    <header className="relative bg-primary pt-16 pb-24 px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle className="text-surface-container-lowest/80 hover:bg-surface-container-lowest/10 hover:text-surface-container-lowest" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-surface-container-lowest/20">
          <span className="material-symbols-outlined text-white text-4xl">
            directions_bus
          </span>
        </div>

        <h1 className="text-white text-2xl font-extrabold tracking-tight mb-3">
          São Fidélis Transporte
        </h1>

        <p className="text-primary-fixed-dim text-sm max-w-[260px] leading-relaxed font-medium">
          Conectando estudantes e servidores ao futuro.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 opacity-10 pointer-events-none">
        <img
          alt="Modern bus on city road"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUbfaiY-x-zGwM21ZXE1lz4y05uwksZ_f-_YgQiZ8Cs5f_fkU1DrALLiZdMcdF7ZqPptayqTqmL9Guw0rM8yXpAN224lb-3l9eAFDwQqrtbft3iJiVFxtgpohkxzCWiSoJi6g1qED-N62H2N9BO3EOoTnV9gHaV0IYJ8V38BjxIxgPFvz5cDM6F5y3IIfCsWBjNWSWW4AkKdnK4lXy-HVN0odQFwuZ9DiFPOSt-JjCpcqPZGad75-6tKKotV8mrmUf6MexbApzoq4"
        />
      </div>
    </header>
  );
}