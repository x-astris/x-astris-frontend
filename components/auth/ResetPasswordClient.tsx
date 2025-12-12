"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    setToken(t);
    setChecked(true);
  }, [searchParams]);

  // ⏳ wait for hydration
  if (!checked) {
    return <p>Loading…</p>;
  }

  // ❌ truly missing
  if (!token) {
    return (
      <p style={{ color: "#b91c1c" }}>
        Invalid or expired reset link.
      </p>
    );
  }

  return <ResetPasswordForm token={token} />;
}
