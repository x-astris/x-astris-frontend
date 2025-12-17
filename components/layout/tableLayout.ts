import type { CSSProperties } from "react";

/* ================= COLUMN WIDTHS ================= */

export const COL_FIRST: CSSProperties = {
  width: "180px", // 🔑 Cash Flow is leidend
};

export const COL_FIRST_YEAR: CSSProperties = {
  width: "80px",
};

export const COL_YEAR: CSSProperties = {
  width: "110px",
};

/* ================= BASE CELL STYLES ================= */

export const head: CSSProperties = {
  padding: 8,
  border: "1px solid #ccc",
  background: "#f3f3f3",
  textAlign: "center",
};

export const cell: CSSProperties = {
  padding: 8,
  border: "1px solid #ccc",
  textAlign: "right",
  verticalAlign: "middle",
};

export const left: CSSProperties = {
  ...cell,
  textAlign: "left",
};
