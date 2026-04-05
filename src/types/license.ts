export type LicenseStatus = "active" | "inactive" | "expired";

export interface License {
  id: string;
  studentId: string;
  imageLicense: string;
  status: LicenseStatus;
  existing: boolean;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
}
