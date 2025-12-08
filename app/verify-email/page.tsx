"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    // Call backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Verification failed");
        return res.json();
      })
      .then(() => {
        setStatus("success");

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/login?verified=1");
        }, 2000);
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && <p>Email verified! Redirecting to login…</p>}
      {status === "error" && <p>Invalid or expired verification link.</p>}
    </div>
  );
}
