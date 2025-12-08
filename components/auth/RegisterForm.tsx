"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      // Redirect to login after success
      alert("Check your email to verify your account.");
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
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

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 12,
        }}
      />

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
