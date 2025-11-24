// app/login/page.tsx

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
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
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Login
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Log in to access your project financials.
        </p>

        {/* Login Form */}
        <LoginForm />

        {/* Link to register */}
        <p
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          Don’t have an account?{" "}
          <a
            href="/register"
            style={{
              color: "#0070f3",
              textDecoration: "underline",
            }}
          >
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
