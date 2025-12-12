export const dynamic = "force-dynamic";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Link from "next/link";
import "../login/login.css";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token ?? null;

  return (
    <main className="login-page">
      {/* LEFT – BRANDING */}
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

      {/* RIGHT – PANEL */}
      <section className="login-panel">
        <div className="login-card">
          <h2>Reset password</h2>
          <p className="login-subtitle">
            Choose a new password to secure your account
          </p>

          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <p style={{ color: "#b91c1c" }}>
              Invalid or expired reset link.
            </p>
          )}

          <p className="login-meta">
            Remembered your password?{" "}
            <Link href="/login">Back to login</Link>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="login-footer">
        <Link href="/privacy">Privacy Policy</Link>
      </footer>
    </main>
  );
}
