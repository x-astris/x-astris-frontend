"use client";

import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import "../login/login.css";

export default function ForgotPasswordPage() {
  return (
    <main className="login-page">
      <aside className="login-branding">
        <p className="product-label">X-ASTRiS Platform</p>

        <h1>Financial modelling for value-driven decisions</h1>

        <ul>
    <li>See how your strategy turns into cash flow</li>
    <li>Focus on the few business drivers that truly matter</li>
    <li>Understand short- and long-term impact in one model</li>
    <li>Start modelling immediately with minimal assumptions</li>
        </ul>
      </aside>

      <section className="login-panel">
        <div className="login-card">
          <h2>Reset password</h2>
          <p className="login-subtitle">
            Enter your email and we’ll send you instructions.
          </p>

          <ForgotPasswordForm />

          <p className="login-link">
            <Link href="/login">Back to login</Link>
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
