"use client";

export default function SaveButton({
  saving,
  saved,
  error,
  onClick,
}: {
  saving: boolean;
  saved: boolean;
  error: string;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
      }}
    >
      <button
        onClick={onClick}
        disabled={saving}
        style={{
          padding: "10px 18px",      // same as Back to Projects
          background: "#666",        // same as Back to Projects
          color: "white",            // same
          borderRadius: 6,           // same
          fontWeight: 600,           // same
          fontSize: 14,              // same
          border: "none",
          cursor: "pointer",
          opacity: saving ? 0.7 : 1, // subtle disabled look
          whiteSpace: "nowrap",
        }}
      >
        {saving ? "Saving…" : "Save"}
      </button>

      {saved && (
        <span style={{ color: "green", fontWeight: "bold" }}>✓</span>
      )}

      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}
