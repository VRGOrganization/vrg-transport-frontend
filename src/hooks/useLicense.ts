"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import type { License } from "@/types/license";

interface UseLicenseResult {
  license: License | null;
  loading: boolean;
  hasLicense: boolean;
}

export function useLicense(): UseLicenseResult {
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<License>("/license/me")
      .then(setLicense)
      .catch(() => setLicense(null))
      .finally(() => setLoading(false));
  }, []);

  return { license, loading, hasLicense: license !== null };
}