"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("LOGIN SUCCESS:", data);

      // Redirect after successful login
      localStorage.setItem("token", data.token);
      window.location.href = "/projects";
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p
          style={{
            color: "red",
            marginBottom: 12,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}

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
          marginBottom: 16,
        }}
      />

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
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
