"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SaveButton from "../balance/ui/SaveButton";
import LogoutButton from "../LogoutButton";

export default function TopTabs({
  projectId,
  onSave,
  saving,
  saved,
  error,
}: {
  projectId: string;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  error: string;
}) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;

  const tabs = [
    { name: "P&L", href: `${base}/pl` },
    { name: "Balance Sheet", href: `${base}/balance` },
    { name: "Cash Flow", href: `${base}/cashflow` },
    { name: "Dashboard", href: `${base}/dashboard` },
  ];

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #ccc",
        padding: "10px 0",
        marginBottom: 16,
      }}
    >
      {/* LEFT SIDE — TABS */}
      <div style={{ display: "flex", gap: 16 }}>
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              textDecoration: "none",
              fontWeight: pathname.startsWith(t.href) ? "bold" : "normal",
              color: pathname.startsWith(t.href) ? "#000" : "#555",
            }}
          >
            {t.name}
          </Link>
        ))}
      </div>

      {/* RIGHT SIDE — ACTION BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {/* BACK BUTTON TO PROJECT OVERVIEW */}
        <Link
          href="/projects"
          style={{
            padding: "10px 18px",
            background: "#666",
            color: "white",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Projects
        </Link>

        <SaveButton
          saving={saving}
          saved={saved}
          error={error}
          onClick={onSave}
        />

        <LogoutButton />
      </div>
    </div>
  );
}
