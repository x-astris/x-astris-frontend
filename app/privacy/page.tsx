import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <p style={{ textAlign: "center", color: "#999", marginBottom: 32 }}>
          Last updated: December 2025
        </p>

        <div style={{ lineHeight: 1.6, color: "#444", fontSize: 15 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            1. Introduction
          </h2>
          <p>
            X-ASTRiS (“we”, “our”) provides a financial modelling application.
            This Privacy Policy explains how we collect, use, store, and
            protect your information when you use the X-ASTRiS Financial
            Modelling App.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            2. Information We Collect
          </h2>
          <p><strong>Account Information:</strong> email and encrypted password.</p>
          <p><strong>Project Data:</strong> financial project inputs, models, and notes.</p>
          <p><strong>Technical Data:</strong> browser info, device info, IP address,
            authentication cookies or tokens.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            3. How We Use Your Data
          </h2>
          <ul style={{ marginLeft: 20, listStyle: "disc" }}>
            <li>Provide access to the App</li>
            <li>Save and manage financial projects</li>
            <li>Improve functionality and user experience</li>
            <li>Maintain security</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            4. Storage of Your Data
          </h2>
          <p>
            Your data is stored on a PostgreSQL server hosted by Render.com.
            Render provides secure infrastructure for data storage.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            5. Sharing of Data
          </h2>
          <p>We do not sell your data. We only share it with:</p>
          <ul style={{ marginLeft: 20, listStyle: "disc" }}>
            <li>Render.com (hosting provider)</li>
            <li>Legal authorities if required by law</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            6. Cookies & Authentication
          </h2>
          <p>
            We use secure cookies or tokens for authentication, login sessions,
            and security purposes.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            7. Data Retention
          </h2>
          <p>
            Data is retained while your account is active. You may request deletion
            at any time by contacting us.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            8. Your Rights
          </h2>
          <p>
            You may request access, correction, deletion, or export of your data by
            emailing us at support@x-astris.com.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            9. Children’s Privacy
          </h2>
          <p>The App is not intended for users under 16.</p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            10. Changes
          </h2>
          <p>We may update this policy periodically. The latest version is posted here.</p>

          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 24 }}>
            11. Contact Us
          </h2>
          <p>Email: support@x-astris.com</p>
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
