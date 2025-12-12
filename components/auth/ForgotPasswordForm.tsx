"use client";

import { useState } from "react";

export default function ResetPasswordForm({ token }: { token: string | null }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setMessage(data.message || "Your password has been updated.");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
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
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 12,
          background: "#f1f5f9", // matches login look
        }}
      />

      {error && (
        <p style={{ color: "#b91c1c", marginBottom: 12, fontSize: 14 }}>
          {error}
        </p>
      )}

      {message && (
        <p style={{ color: "#0b3d91", marginBottom: 12, fontSize: 14 }}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Resetting…" : "Reset Password"}
      </button>
    </form>
  );
}
