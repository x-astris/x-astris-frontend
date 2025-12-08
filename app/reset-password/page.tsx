"use client";

import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      }
    );

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setSuccess(true);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
        }}
      >
        {!success ? (
          <>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Choose a New Password
            </h1>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  marginBottom: 16,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: 12,
                  background: "#0070f3",
                  color: "#ffffff",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reset Password
              </button>
            </form>

            {message && (
              <p style={{ marginTop: 16, textAlign: "center", color: "#0070f3" }}>
                {message}
              </p>
            )}
          </>
        ) : (
          // SUCCESS STATE
          <>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Password Reset Successful
            </h1>

            <p
              style={{
                fontSize: 15,
                color: "#666",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Your password has been updated. You can now log in using your new password.
            </p>

            <a
              href="/login"
              style={{
                display: "block",
                textAlign: "center",
                padding: 12,
                background: "#0070f3",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Go to Login
            </a>
          </>
        )}
      </div>
    </main>
  );
}
