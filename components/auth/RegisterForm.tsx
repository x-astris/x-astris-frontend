"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.message || "Registration failed");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ textAlign: "center" }}>
        <h3>Check your inbox</h3>
        <p style={{ marginTop: 8 }}>
          We’ve sent a verification email to
          <br />
          <strong>{email}</strong>
        </p>
        <p style={{ marginTop: 12, fontSize: 14, color: "#666" }}>
          Please click the link in the email to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 12,
        }}
      />

      {/* Password field with professional eye icon */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 12,
            paddingRight: 44,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            padding: 4,
            cursor: "pointer",
            opacity: 0.6,
          }}
        >
          {showPassword ? (
            /* Eye-off */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3l18 18"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M10.58 10.58a2 2 0 002.83 2.83"
                stroke="#333"
                strokeWidth="2"
              />
              <path
                d="M16.24 16.24C14.9 17.1 13.47 17.5 12 17.5c-4.5 0-8.27-3.11-9.5-5.5a10.7 10.7 0 012.6-3.34M9.76 6.24A9.3 9.3 0 0112 6.5c4.5 0 8.27 3.11 9.5 5.5a10.6 10.6 0 01-1.67 2.45"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            /* Eye */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12 18 19.5 12 19.5 1.5 12 1.5 12z"
                stroke="#333"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="#333"
                strokeWidth="2"
              />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: 12, fontSize: 14 }}>
          {error}
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
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
