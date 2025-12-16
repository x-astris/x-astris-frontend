// app/verify-email/page.tsx

import { Suspense } from "react";
import Link from "next/link";
import VerifyEmailInner from "./VerifyEmailInner";
import "../login/login.css";

export const dynamic = "force-dynamic"; // keep as-is

export default function VerifyEmailPage() {
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
          <Suspense
            fallback={
              <>
                <h2>Verifying email</h2>
                <p className="login-subtitle">
                  Please wait while we verify your email address.
                </p>
              </>
            }
          >
            <VerifyEmailInner />
          </Suspense>

          {/* Safe escape hatch */}
          <p className="login-link">
            <Link href="/login">Back to login</Link>
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
