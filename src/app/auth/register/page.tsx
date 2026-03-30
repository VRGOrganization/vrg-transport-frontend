import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex-grow flex items-center justify-center p-4 md:p-8 bg-mesh">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-surface-container-lowest shadow-2xl rounded-xl">
        {/* Left Side: Brand Visuals & Info - Desktop only */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
              <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">
                  directions_bus
                </span>
              </div>
              <h1 className="font-headline font-extrabold text-2xl text-white tracking-tight">
                São Fidélis Transporte
              </h1>
            </div>
            <h2 className="font-headline text-4xl font-bold text-white mb-6 leading-tight">
              Comece sua <span className="text-secondary-fixed">jornada</span> conosco.
            </h2>
            <p className="text-primary-fixed-dim text-lg max-w-md">
              Crie sua conta e tenha acesso ao transporte institucional.
            </p>
          </div>
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-secondary rounded-full blur-3xl opacity-20" />
        </div>

        {/* Right Side: Register Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-4xl">
              directions_bus
            </span>
            <span className="font-headline font-extrabold text-xl text-primary tracking-tight">
              São Fidélis Transporte
            </span>
          </div>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}