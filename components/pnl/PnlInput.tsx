"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { api } from "@/lib/api/client";
import TopTabs from "../layout/TopTabs";

/* ------------------------------- TYPES ------------------------------- */

type PnlRow = {
  year: number;
  revenue: number;
  cogs: number;
  opex: number;
  depreciation: number;
  interest: number;
  taxes: number;

  revenueGrowthPct?: number;
  cogsPct?: number | null;
  opexPct?: number | null;
  taxRatePct?: number;
};

/* ------------------------------- STYLES ------------------------------ */

type Style = CSSProperties;

const COL_FIRST: Style = { width: "220px" };
const COL_FIRST_YEAR: Style = { width: "80px" };
const COL_YEAR: Style = { width: "110px" };

const head: Style = {
  padding: 8,
  border: "1px solid #ccc",
  background: "#f3f3f3",
  textAlign: "center",
};

const cell: Style = {
  padding: 8,
  border: "1px solid #ccc",
  textAlign: "right",
  verticalAlign: "middle",
};

const left: Style = {
  ...cell,
  textAlign: "left",
};

const inputMoney: Style = {
  width: "100%",
  border: "1px solid #ccc",
  background: "#fff8d6",
  textAlign: "right",
  padding: "4px 6px",
  borderRadius: 4,
};

const inputPct: Style = {
  width: "100%",
  border: "1px solid #ccc",
  background: "#fff8d6",
  textAlign: "right",
  padding: "4px 6px",
  borderRadius: 4,
};

/* ------------------------ FORMATTERS + ROUNDING ----------------------- */

const round1 = (v: number) => Math.round(v * 10) / 10;

/* Locale-aware formatting */
const getLocale = () =>
  typeof navigator !== "undefined" ? navigator.language : "en-US";

export default function PnlInput({
  projectId,
  startYear,
  forecastYears,
}: {
  projectId: string;
  startYear: number;
  forecastYears: number;
}) {
  const locale = getLocale(); // <-- detect browser locale
  const [showWarning, setShowWarning] = useState(true);

  const fmt = (v: number) =>
    (v ?? 0).toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const fmtPct = (v: number) =>
    (v ?? 0).toLocaleString(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    const fmtNormal = (v: number, decimals = 0) => {
  const n = v ?? 0;

  const formatted = Math.abs(n).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return n < 0 ? `(${formatted})` : formatted;
};

    const fmtCost = (v: number) => {
  const n = v ?? 0;
  const formatted = Math.abs(n).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Positive numbers → wrap in ()
  if (n > 0) return `(${formatted})`;

  // Negative numbers → show abs value WITHOUT minus, without ()
  if (n < 0) return formatted;

  // Zero stays "0"
  return formatted;
};

    

  /* -------------------------------------------------------------------- */

  const years = useMemo(
    () => Array.from({ length: forecastYears }, (_, i) => startYear + i),
    [startYear, forecastYears]
  );
  const firstYear = years[0];

  const [rows, setRows] = useState<PnlRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------- LOAD DATA ---------------------------- */

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/pnl?projectId=${projectId}`);
        const data: any[] = res.data || [];

        const initial: PnlRow[] = years.map((year) => {
          const found = data.find((r) => r.year === year);
          return {
            year,
            revenue: found?.revenue ?? 0,
            cogs: found?.cogs ?? 0,
            opex: found?.opex ?? 0,
            depreciation: found?.depreciation ?? 0,
            interest: found?.interest ?? 0,
            taxes: found?.taxes ?? 0,

            // ⭐ Load KPI's from backend (NEW)
            revenueGrowthPct: found?.revenueGrowthPct ?? 0,
            cogsPct: found?.cogsPct ?? null,
            opexPct: found?.opexPct ?? null,
            taxRatePct: found?.taxRatePct ?? 25,
          };
        });

        setRows(initial);
      } catch (e) {
        console.error(e);
        setError("Failed to load P&L data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId, years]);

  /* ------------------------- UPDATE HELPERS -------------------------- */

  const updateField = (year: number, field: keyof PnlRow, value: number) => {
    setRows((prev) =>
      prev.map((r) => (r.year === year ? { ...r, [field]: value } : r))
    );
  };

  const updateGrowthPct = (year: number, v: number) =>
    updateField(year, "revenueGrowthPct", round1(v));

  const updateCogsPct = (year: number, v: number) =>
    updateField(year, "cogsPct", round1(v));

  const updateOpexPct = (year: number, v: number) =>
    updateField(year, "opexPct", round1(v));

  const updateTaxRatePct = (year: number, v: number) =>
    updateField(year, "taxRatePct", round1(v));

  /* ------------------------- COMPUTED METRICS ------------------------ */

  const computed = useMemo(() => {
    if (!rows.length) return [];

    const base = rows.find((r) => r.year === firstYear) ?? rows[0];
    const baseRevenue = base.revenue || 0;

    const baseCogsPct = baseRevenue ? (base.cogs / baseRevenue) * 100 : 0;
    const baseOpexPct = baseRevenue ? (base.opex / baseRevenue) * 100 : 0;

    let prevRevenue = baseRevenue;

    return years.map((year, idx) => {
      const row = rows.find((r) => r.year === year)!;

      const revenue =
        idx === 0
          ? row.revenue
          : Math.round(
              prevRevenue * (1 + (row.revenueGrowthPct ?? 5) / 100)
            );

      prevRevenue = revenue;

      const cogsPctEff = round1(
        idx === 0
          ? revenue
            ? (row.cogs / revenue) * 100
            : 0
          : row.cogsPct ?? baseCogsPct
      );

      const cogs =
        idx === 0 ? row.cogs : Math.round((cogsPctEff / 100) * revenue);

      const opexPctEff = round1(
        idx === 0
          ? revenue
            ? (row.opex / revenue) * 100
            : 0
          : row.opexPct ?? baseOpexPct
      );

      const opex =
        idx === 0 ? row.opex : Math.round((opexPctEff / 100) * revenue);

      const dep = row.depreciation || 0;
      const int = row.interest || 0;

      const grossMargin = revenue - cogs;
      const EBITDA = grossMargin - opex;
      const EBIT = EBITDA - dep;
      const EBT = EBIT - int;

      const taxRate = round1(
        idx === 0
          ? EBT
            ? (row.taxes / EBT) * 100
            : 0
          : row.taxRatePct ?? 25
      );

      const tax =
        idx === 0
          ? row.taxes
          : EBT > 0
          ? Math.round(EBT * (taxRate / 100))
          : 0;

      const netResult = EBT - tax;

      return {
        year,
        revenue,
        cogs,
        opex,
        dep,
        int,
        grossMargin,
        EBITDA,
        EBIT,
        EBT,
        tax,
        netResult,
        cogsPctEff,
        opexPctEff,
        taxRate,
      };
    });
  }, [rows, years, firstYear]);

  /* ------------------------------ SAVE ----------------------------- */

  async function save() {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      await api.delete("/pnl", { params: { projectId } });

      for (const c of computed) {
        await api.post("/pnl/add", {
          projectId,
          year: c.year,
          revenue: c.revenue,
          cogs: c.cogs,
          opex: c.opex,
          depreciation: c.dep,
          interest: c.int,
          taxes: c.tax,
          revenueGrowthPct: rows.find(r => r.year === c.year)?.revenueGrowthPct ?? 0,
          cogsPct: rows.find(r => r.year === c.year)?.cogsPct ?? null,
          opexPct: rows.find(r => r.year === c.year)?.opexPct ?? null,
          taxRatePct: rows.find(r => r.year === c.year)?.taxRatePct ?? 25,
        });
      }

      setSaved(true);
      setShowWarning(false);
    } catch (e) {
      console.error("SAVE ERROR:", e);
      setError("Failed to save P&L");
    } finally {
      setSaving(false);
    }
  }

  /* ------------------------------ RENDER ----------------------------- */

  if (loading) return <p>Loading P&amp;L…</p>;

  return (
<>

 <div
  style={{
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "white",
  }}
>
  <TopTabs
    projectId={projectId}
    onSave={save}
    saving={saving}
    saved={saved}
    error={error}
  />

  {showWarning && (
    <div
      style={{
        padding: "8px 12px",
        background: "#fff3cd",
        borderBottom: "1px solid #ffeeba",
        color: "#856404",
        fontSize: 14,
        textAlign: "center",
      }}
    >
      ⚠️ Please click <strong>Save</strong> before navigating away — otherwise your input will be lost.
    </div>
  )}
</div>


  <div style={{ padding: 24 }}>

      <h2
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 16,
        }}
      >
        P&amp;L Input
      </h2>

      {/* INPUT TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 24,
        }}
      >
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}>P&L Input</th>
            {years.map((y, idx) => (
              <th
                key={y}
                style={{
                  ...head,
                  ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR),
                }}
              >
                {y}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* REVENUE */}
          <tr>
            <td style={left}>Revenue</td>
            {years.map((year, idx) => {
              const row = rows.find((r) => r.year === year);
              const c = computed[idx];
              return (
                <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {idx === 0 ? (
                    <input
                      type="number"
                      value={row?.revenue ?? 0}
                      onChange={(e) =>
                        updateField(year, "revenue", Number(e.target.value))
                      }
                      step={500}
                      style={inputMoney}
                    />
                  ) : (
                    fmt(c.revenue)
                  )}
                </td>
              );
            })}
          </tr>

          {/* REVENUE GROWTH */}
          <tr>
            <td style={left}>Revenue Growth (%)</td>
            {years.map((year, idx) => {
              const row = rows.find((r) => r.year === year);
              return (
                <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {idx === 0 ? (
                    "N/A"
                  ) : (
                    <input
                      type="number"
                      value={row?.revenueGrowthPct ?? 0}
                      onChange={(e) =>
                        updateGrowthPct(year, Number(e.target.value))
                      }
                      step={0.1}
                      style={inputPct}
                    />
                  )}
                </td>
              );
            })}
          </tr>

          {/* COGS */}
          <tr>
            <td style={left}>COGS</td>
            {years.map((year, idx) => {
              const row = rows.find((r) => r.year === year);
              const c = computed[idx];
              return (
                <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {idx === 0 ? (
                    <input
                      type="number"
                      value={row?.cogs ?? 0}
                      onChange={(e) =>
                        updateField(year, "cogs", Number(e.target.value))
                      }
                      step={500}
                      style={inputMoney}
                    />
                  ) : (
                    fmt(c.cogs)
                  )}
                </td>
              );
            })}
          </tr>

          {/* COGS % */}
          <tr>
            <td style={left}>COGS (% of revenue)</td>
            {years.map((year, idx) => {
              const row = rows.find((r) => r.year === year);
              return (
                <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {idx === 0 ? (
                    fmtPct(computed[idx].cogsPctEff)
                  ) : (
                    <input
                      type="number"
                      value={row?.cogsPct ?? computed[0].cogsPctEff}
                      onChange={(e) => updateCogsPct(year, Number(e.target.value))}
                      step={0.1}
                      style={inputPct}
                    />
                  )}
                </td>
              );
            })}
          </tr>

          {/* OPEX */}
          <tr>
            <td style={left}>OPEX</td>
            {years.map((year, idx) => {
              const row = rows.find((r) => r.year === year);
              const c = computed[idx];
              return (
                <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {idx === 0 ? (
                    <input
                      type="number"
                      value={row?.opex ?? 0}
                      onChange={(e) =>
                        updateField(year, "opex", Number(e.target.value))
                      }
                      step={500}
                      style={inputMoney}
                    />
                  ) : (
                    fmt(c.opex)
                  )}
                </td>
              );
            })}
          </tr>

          {/* OPEX % */}
          <tr>
            <td style={left}>OPEX (% of revenue)</td>
            {years.map((year, idx) => {
              const row = rows.find((r) => r.year === year);
              return (
                <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {idx === 0 ? (
                    fmtPct(computed[idx].opexPctEff)
                  ) : (
                    <input
                      type="number"
                      value={row?.opexPct ?? computed[0].opexPctEff}
                      onChange={(e) =>
                        updateOpexPct(year, Number(e.target.value))
                      }
                      step={0.1}
                      style={inputPct}
                    />
                  )}
                </td>
              );
            })}
          </tr>

          {/* DEPRECIATION */}
          <tr>
            <td style={left}>Depreciation</td>
            {years.map((year, idx) => {
              const row = rows.find((r) => r.year === year);
              return (
                <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {idx === 0 ? (
                    <input
                      type="number"
                      value={row?.depreciation ?? 0}
                      onChange={(e) =>
                        updateField(year, "depreciation", Number(e.target.value))
                      }
                      step={500}
                      style={inputMoney}
                    />
                  ) : (
                    fmt(row?.depreciation ?? 0)
                  )}
                </td>
              );
            })}
          </tr>

          {/* INTEREST */}
          <tr>
            <td style={left}>Interest</td>
            {years.map((year, idx) => {
              const row = rows.find((r) => r.year === year);
              return (
                <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {idx === 0 ? (
                    <input
                      type="number"
                      value={row?.interest ?? 0}
                      onChange={(e) =>
                        updateField(year, "interest", Number(e.target.value))
                      }
                      step={100}
                      style={inputMoney}
                    />
                  ) : (
                    fmt(row?.interest ?? 0)
                  )}
                </td>
              );
            })}
          </tr>

          {/* TAX */}
          <tr>
            <td style={left}>Tax</td>
            {years.map((year, idx) => (
              <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {idx === 0 ? (
                  <input
                    type="number"
                    value={rows[idx]?.taxes ?? 0}
                    onChange={(e) =>
                      updateField(year, "taxes", Number(e.target.value))
                    }
                    step={100}
                    style={inputMoney}
                  />
                ) : (
                  fmt(computed[idx].tax)
                )}
              </td>
            ))}
          </tr>

          {/* TAX RATE (%) */}
          <tr>
            <td style={left}>Tax Rate (%)</td>
            {years.map((year, idx) => {
              const row = rows.find((r) => r.year === year);
              return (
                <td key={year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                  {idx === 0 ? (
                    fmtPct(computed[idx].taxRate)
                  ) : (
                    <input
                      type="number"
                      value={row?.taxRatePct ?? 25}
                      onChange={(e) =>
                        updateTaxRatePct(year, Number(e.target.value))
                      }
                      step={0.1}
                      style={inputPct}
                    />
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* SUMMARY TABLE */}
      <h3 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        P&amp;L Output
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 24,
        }}
      >
        <thead>
          <tr>
            <th style={{ ...head, ...COL_FIRST }}>P&L Output</th>
            {years.map((y, idx) => (
              <th key={y} style={{ ...head, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {y}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>Revenue</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, fontWeight: "bold", ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(c.revenue)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>COGS</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtCost(c.cogs)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>Gross Margin</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, fontWeight: "bold", ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(c.grossMargin)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>OPEX</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtCost(c.opex)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>EBITDA</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, fontWeight: "bold", ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(c.EBITDA)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Depreciation</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtCost(c.dep)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>EBIT</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, fontWeight: "bold", ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(c.EBIT)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Interest</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtCost(c.int)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>EBT</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, fontWeight: "bold", ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(c.EBT)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={left}>Tax</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtCost(c.tax)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={{ ...left, fontWeight: "bold" }}>Net Result</td>
            {computed.map((c, idx) => (
              <td key={c.year} style={{ ...cell, fontWeight: "bold", ...(idx === 0 ? COL_FIRST_YEAR : COL_YEAR) }}>
                {fmtNormal(c.netResult)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* BOTTOM SAVE BUTTON */}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "10px 18px",
            background: "#0070f3",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {saving ? "Saving…" : "Save P&L"}
        </button>

        {saved && (
          <span
            style={{
              marginLeft: 12,
              color: "green",
              fontWeight: "bold",
            }}
          >
            ✓ Saved!
          </span>
        )}

        {error && <span style={{ marginLeft: 12, color: "red" }}>{error}</span>}
      </div>
    </div>
</>
  );
}
