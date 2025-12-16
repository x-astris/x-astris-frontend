import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import "./login.css";

export default function LoginPage() {
  return (

<main className="login-page">
  <aside className="login-branding">
    <p className="product-label">X-ASTRiS Platform</p>

    <h1>Financial modelling for value-driven decisions</h1>

    <ul>
      <li>Cash flow modelling - Fast and easy</li>
      <li>Simple driver-based interface</li>
      <li>Choose up to 10 forecast years</li>
      <li>Only 1 base year is required to start modelling</li>
    </ul>
  </aside>

  <section className="login-panel">
    <div className="login-card">
      <h2>Login</h2>
      <p className="login-subtitle">
        Access your financial models
      </p>

      <LoginForm />

      <p className="login-link">
        <Link href="/forgot-password">Forgot your password?</Link>
      </p>

      <p className="login-meta">
  No registered yet?{" "}
  <Link href="/register">Register</Link>
</p>
    </div>
  </section>

<footer className="login-footer">
  <Link href="/privacy">Privacy Policy</Link>
  <span className="login-footer-separator">·</span>
  <Link href="/terms">Terms &amp; Conditions</Link>
</footer>

</main>

  );
}
