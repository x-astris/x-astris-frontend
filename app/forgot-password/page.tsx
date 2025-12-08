"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
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
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
          Reset Password
        </h1>

        <p style={{ fontSize: 14, color: "#666", marginBottom: 24, textAlign: "center" }}>
          Enter your email and we’ll send you instructions.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Send Reset Link
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 16, textAlign: "center", color: "#0070f3" }}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
