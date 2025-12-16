// app/register/page.tsx

import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import "../login/login.css";

export default function RegisterPage() {
  return (
    <main className="login-page">
      {/* LEFT BRANDING */}
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

      {/* RIGHT PANEL */}
      <section className="login-panel">
        <div className="login-card">
          <h2>Create account</h2>

          <p className="login-subtitle">
            Register to access the X-ASTRiS financial modelling platform
          </p>

          <RegisterForm />

          <p className="login-link">
            {" "}
            <Link href="/login">Back to Login</Link>
          </p>
        </div>
      </section>

      {/* FOOTER */}
<footer className="login-footer">
  <Link href="/privacy">Privacy Policy</Link>
  <span className="login-footer-separator">·</span>
  <Link href="/terms">Terms &amp; Conditions</Link>
</footer>
    </main>
  );
}
