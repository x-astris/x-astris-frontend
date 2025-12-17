import Link from "next/link";

export default function TermsPage() {
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
          maxWidth: 700,
          background: "#ffffff",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Terms & Conditions
        </h1>

        <p style={{ textAlign: "center", color: "#999", marginBottom: 32 }}>
          Last updated: December 2025
        </p>

        <div style={{ lineHeight: 1.6, color: "#444", fontSize: 15 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            1. Company Information
          </h2>
          <p>
            X-ASTRiS is operated by <strong>Fiscalini Management BV</strong>,
            registered at Julianaweg 412, 3523XM, Utrecht, The Netherlands.
          </p>
          <p>
            Chamber of Commerce (KvK): [TO BE COMPLETED]
            <br />
            VAT number: [TO BE COMPLETED]
            <br />
            Contact: support@x-astris.com
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            2. Applicability
          </h2>
          <p>
            These Terms and Conditions apply exclusively to business users (B2B).
            By creating an account or using X-ASTRiS, you agree to these Terms.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            3. The Service
          </h2>
          <p>
            X-ASTRiS is a web-based financial modelling tool for cash flow
            forecasting, scenario analysis, and valuation purposes. The service
            is provided as Software-as-a-Service (SaaS).
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            4. Accounts & Access
          </h2>
          <p>
            Use of the App requires registration. You are responsible for
            maintaining the confidentiality of your login credentials and all
            activities performed under your account.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            5. Subscriptions & Payment
          </h2>
          <p>
            X-ASTRiS is offered on a yearly subscription basis, payable in
            advance. Subscriptions are automatically renewed unless cancelled
            before the end of the current subscription period.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            6. Cancellation & Termination
          </h2>
          <p>
            You may cancel your subscription before the end of the current
            subscription term. Cancellation becomes effective at the end of the
            subscription period. No refunds are provided for unused time.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            7. No Financial Advice
          </h2>
          <p>
            X-ASTRiS does not provide financial, investment, tax, or legal
            advice. All outputs are informational only. You remain fully
            responsible for the interpretation and use of results.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            8. User Data
          </h2>
          <p>
            All data entered into X-ASTRiS remains your property. We process
            data solely for providing and improving the service, in accordance
            with our Privacy Policy.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            9. Intellectual Property
          </h2>
          <p>
            All intellectual property rights related to X-ASTRiS remain the
            exclusive property of Fiscalini Management BV. You receive a
            limited, non-transferable license to use the App during your
            subscription.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            10. Limitation of Liability
          </h2>
          <p>
            Our total liability is limited to the amount paid by you in the
            twelve (12) months preceding the event giving rise to liability.
            Indirect or consequential damages, including loss of profit or
            data, are excluded.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            11. Governing Law
          </h2>
          <p>
            These Terms are governed by Dutch law. Any disputes shall be
            submitted exclusively to the District Court of Midden-Nederland
            (Utrecht).
          </p>
        </div>

        {/* Back to Login Button */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link
            href="/login"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#0070f3",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
