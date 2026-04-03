export interface DashboardAction {
  href: string;
  title: string;
  description: string;
  icon: string;
  bg: string;
  iconBg: string;
  titleColor: string;
  descColor: string;
  iconColor: string;
  overlay: boolean;
}

export const DASHBOARD_ACTIONS: DashboardAction[] = [
  {
    href: "/dashboard/card",
    title: "Visualização da carteirinha",
    description: "Sua carteira digital QR Code",
    icon: "qr_code_2",
    bg: "bg-tertiary",
    iconBg: "bg-white/10",
    titleColor: "text-white",
    descColor: "text-white/80",
    iconColor: "text-white",
    overlay: false,
  },
  {
    href: "/dashboard/profile",
    title: "Alteração de informações",
    description: "Editar perfil e preferências",
    icon: "manage_accounts",
    bg: "bg-surface-container-low",
    iconBg: "bg-surface-container-high",
    titleColor: "text-on-surface",
    descColor: "text-on-surface-variant",
    iconColor: "text-primary",
    overlay: false,
  },
];
