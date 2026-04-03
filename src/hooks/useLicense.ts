"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { License } from "@/types/license";

interface UseLicenseResult {
  license: License | null;
  loading: boolean;
  hasLicense: boolean;
}

export function useLicense(): UseLicenseResult {
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicense = async () => {
      try {
        const data = await api.get<License>("/license/me");
        setLicense(data);
      } catch {
        setLicense(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLicense();
  }, []);

  return { license, loading, hasLicense: license !== null };
}
