"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailInner() {
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

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
        setTimeout(() => router.push("/login?verified=1"), 2000);
      })
      .catch(() => setStatus("error"));
  }, [params, router]);

  if (status === "loading") {
    return (
      <>
        <h2>Verifying email</h2>
        <p className="login-subtitle">
          Please wait while we verify your email address.
        </p>
      </>
    );
  }

  if (status === "success") {
    return (
      <>
        <h2>Email verified</h2>
        <p className="login-subtitle">
          Your email address has been successfully verified.
          Redirecting you to the login page.
        </p>
      </>
    );
  }

  return (
    <>
      <h2>Verification failed</h2>
      <p className="login-subtitle">
        This verification link is invalid or has expired.
      </p>

      <Link href="/login" className="auth-button">
        Go to login
      </Link>
    </>
  );
}
