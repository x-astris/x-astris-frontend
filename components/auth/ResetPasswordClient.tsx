"use client";

import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <p style={{ color: "#b91c1c" }}>
        Invalid or expired reset link.
      </p>
    );
  }

  return <ResetPasswordForm token={token} />;
}
