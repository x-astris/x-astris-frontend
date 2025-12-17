"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import SaveButton from "./SaveButton";
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

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { name: "P&L", href: `${base}/pl` },
    { name: "Balance Sheet", href: `${base}/balance` },
    { name: "Cash Flow", href: `${base}/cashflow` },
    { name: "Dashboard", href: `${base}/dashboard` },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      {/* RIGHT SIDE — ACTIONS */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {/* 3-STATEMENT MODEL BUTTON */}
        <Link
          href={`${base}/financialstatements`}
          style={{
            padding: "10px 18px",
            background: "#1f2937",
            color: "white",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          3-statement model
        </Link>

        <SaveButton
          saving={saving}
          saved={saved}
          error={error}
          onClick={onSave}
        />

        {/* DROPDOWN MENU */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ☰
          </button>

          {open && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "110%",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: 6,
                minWidth: 180,
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              <Link
                href="/projects"
                style={{
                  display: "block",
                  padding: "10px 14px",
                  textDecoration: "none",
                  color: "#111",
                }}
                onClick={() => setOpen(false)}
              >
                Back to projects
              </Link>

              <div
                style={{
                  borderTop: "1px solid #eee",
                  padding: "8px 14px",
                }}
              >
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}