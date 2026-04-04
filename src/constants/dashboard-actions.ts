import { QrCode, UserCog, type LucideIcon } from "lucide-react";

export interface DashboardAction {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "primary" | "surface";
}

export const DASHBOARD_ACTIONS: DashboardAction[] = [
  {
    href: "/dashboard/card",
    title: "Visualização da carteirinha",
    description: "Sua carteira digital QR Code",
    icon: QrCode,
    variant: "primary",
  },
  {
    href: "/dashboard/profile",
    title: "Alteração de informações",
    description: "Editar perfil e preferências",
    icon: UserCog,
    variant: "surface",
  },
];