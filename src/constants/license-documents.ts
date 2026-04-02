export interface DocumentConfig {
  photoType: string;
  label: string;
  description: string;
  icon: string;
  required: boolean;
}

export const LICENSE_DOCUMENTS: DocumentConfig[] = [
  {
    photoType: "ProfilePhoto",
    label: "Foto 3x4",
    description: "Foto recente no formato 3x4 (JPEG ou PNG)",
    icon: "face",
    required: true,
  },
  {
    photoType: "EnrollmentProof",
    label: "Comprovante de Matrícula",
    description: "Documento emitido pela instituição de ensino",
    icon: "description",
    required: true,
  },
  {
    photoType: "CourseSchedule",
    label: "Grade Horária",
    description: "Comprovante de horário das aulas",
    icon: "calendar_month",
    required: false,
  },
];
