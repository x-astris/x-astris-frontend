"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { api } from "@/lib/api/client";

import TopTabs from "@/components/layout/TopTabs";
import SaveButton from "@/components/layout/SaveButton";
import PnlOutputTable from "./PnlOutput";

import { PnlRow } from "@/components/pnl/types/pnl";
import { usePnlModel } from "@/components/pnl/hooks/usePnlModel";
import type { PnlModelRow } from "@/components/pnl/hooks/usePnlModel";

/* ---------------------- SHARED LAYOUT ---------------------- */

import {
  COL_FIRST,
  COL_FIRST_YEAR,
  COL_YEAR,
  head,
  cell,
  left,
} from "@/components/layout/tableLayout";

/* ---------------------- FORMATTERS ---------------------- */

import {
  getLocale,
  fmtFactory,
} from "@/components/layout/formatters";

/* ---------------------- INPUT STYLES ---------------------- */

const inputMoney: CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  background: "#fff8d6",
  textAlign: "right",
  padding: "4px 6px",
  borderRadius: 4,
};

const inputPct: CSSProperties = {
  width: "100%",
  border: "1px solid #ccc",
  background: "#fff8d6",
  textAlign: "right",
  padding: "4px 6px",
  borderRadius: 4,
};

const round1 = (v: number) => Math.round(v * 10) / 10;

const hasBalanceSheet = false; // replace when BS is implemented

/* ======================================================
   COMPONENT
====================================================== */

export default function PnlInput({
  projectId,
  startYear,
  forecastYears,
}: {
  projectId: string;
  startYear: number;
  forecastYears: number;
}) {
  const locale = getLocale();
  const fmt = fmtFactory(locale);
  const [showWarning, setShowWarning] = useState(true);

  /* ---------------- YEARS ---------------- */

  const years = useMemo(
    () => Array.from({ length: forecastYears }, (_, i) => startYear + i),
    [startYear, forecastYears]
  );

  /* ---------------- STATE ---------------- */

  const [rows, setRows] = useState<PnlRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.get(`/pnl?projectId=${projectId}`);
        const data: PnlRow[] = res.data || [];

        setRows(
          years.map((year) => {
            const found = data.find((r) => r.year === year);
            return {
              year,
              revenue: found?.revenue ?? 0,
              cogs: found?.cogs ?? 0,
              opex: found?.opex ?? 0,
              depreciation: found?.depreciation ?? 0,
              interest: found?.interest ?? 0,
              taxes: found?.taxes ?? 0,
              revenueGrowthPct: found?.revenueGrowthPct ?? 0,
              cogsPct: found?.cogsPct ?? null,
              opexPct: found?.opexPct ?? null,
              taxRatePct: found?.taxRatePct ?? 25,
            };
          })
        );
      } catch {
        setError("Failed to load P&L data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projectId, years]);

  /* ---------------- UPDATE HELPERS ---------------- */

  const updateField = (
    year: number,
    field: keyof PnlRow,
    value: number
  ) =>
    setRows((prev) =>
      prev.map((r) =>
        r.year === year ? { ...r, [field]: value } : r
      )
    );

  /* ---------------- MODEL (SINGLE SOURCE OF TRUTH) ---------------- */

  const model: PnlModelRow[] = usePnlModel(rows, years);

  /* ---------------- SAVE ---------------- */

  async function save() {
    try {
      setSaving(true);
      setSaved(false);

      await api.delete("/pnl", { params: { projectId } });

      for (const r of model) {
        const input = rows.find((x) => x.year === r.year)!;

        await api.post("/pnl/add", {
          projectId,
          year: r.year,
          revenue: r.revenue,
          cogs: r.cogs,
          opex: r.opex,
          depreciation: r.dep,
          interest: r.int,
          taxes: r.tax,
          revenueGrowthPct: input.revenueGrowthPct ?? 0,
          cogsPct: input.cogsPct ?? null,
          opexPct: input.opexPct ?? null,
          taxRatePct: input.taxRatePct ?? 25,
        });
      }

      setSaved(true);
      setShowWarning(false);
    } catch {
      setError("Failed to save P&L");
    } finally {
      setSaving(false);
    }
  }

  /* ---------------- RENDER ---------------- */

  if (loading) return <p>Loading P&amp;L…</p>;

  return (
    <>
      {/* STICKY TOPTABS */}
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
        <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16 }}>
          P&amp;L Input
        </h2>

        {/* ================= INPUT TABLE ================= */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 32,
          }}
        >
          <thead>
            <tr>
              <th style={{ ...head, ...COL_FIRST }}></th>
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
              {years.map((y, idx) => {
                const row = rows.find((r) => r.year === y)!;
                return (
                  <td key={y} style={cell}>
                    {idx === 0 ? (
                      <input
                        type="number"
                        value={row.revenue}
                        onChange={(e) =>
                          updateField(y, "revenue", Number(e.target.value))
                        }
                        step={500}
                        style={inputMoney}
                      />
                    ) : (
                      fmt(model[idx].revenue)
                    )}
                  </td>
                );
              })}
            </tr>

            {/* REVENUE GROWTH */}
            <tr>
              <td style={left}>Revenue Growth (%)</td>
              {years.map((y, idx) => {
                const row = rows.find((r) => r.year === y)!;
                return (
                  <td key={y} style={cell}>
                    {idx === 0 ? "—" : (
                      <input
                        type="number"
                        value={row.revenueGrowthPct ?? 0}
                        onChange={(e) =>
                          updateField(
                            y,
                            "revenueGrowthPct",
                            round1(Number(e.target.value))
                          )
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
              {years.map((y, idx) => {
                const row = rows.find((r) => r.year === y)!;
                return (
                  <td key={y} style={cell}>
                    {idx === 0 ? (
                      <input
                        type="number"
                        value={row.cogs}
                        onChange={(e) =>
                          updateField(y, "cogs", Number(e.target.value))
                        }
                        step={500}
                        style={inputMoney}
                      />
                    ) : (
                      fmt(model[idx].cogs)
                    )}
                  </td>
                );
              })}
            </tr>

            {/* COGS % */}
            <tr>
              <td style={left}>COGS (% of revenue)</td>
              {years.map((y, idx) => {
                const row = rows.find((r) => r.year === y)!;
                return (
                  <td key={y} style={cell}>
                    {idx === 0
  ? model[0].cogsPctEff.toLocaleString(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })
  : (
      <input
        type="number"
        value={row.cogsPct ?? model[0].cogsPctEff}
        onChange={(e) =>
          updateField(
            y,
            "cogsPct",
            round1(Number(e.target.value))
          )
        }
        step={0.1}
        style={inputPct}
      />
    )
}

                  </td>
                );
              })}
            </tr>

            {/* OPEX */}
            <tr>
              <td style={left}>OPEX</td>
              {years.map((y, idx) => {
                const row = rows.find((r) => r.year === y)!;
                return (
                  <td key={y} style={cell}>
                    {idx === 0 ? (
                      <input
                        type="number"
                        value={row.opex}
                        onChange={(e) =>
                          updateField(y, "opex", Number(e.target.value))
                        }
                        step={500}
                        style={inputMoney}
                      />
                    ) : (
                      fmt(model[idx].opex)
                    )}
                  </td>
                );
              })}
            </tr>

            {/* OPEX % */}
            <tr>
              <td style={left}>OPEX (% of revenue)</td>
              {years.map((y, idx) => {
                const row = rows.find((r) => r.year === y)!;
                return (
                  <td key={y} style={cell}>
{idx === 0
  ? model[0].opexPctEff.toLocaleString(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })
  : (
      <input
        type="number"
        value={row.opexPct ?? model[0].opexPctEff}
        onChange={(e) =>
          updateField(
            y,
            "opexPct",
            round1(Number(e.target.value))
          )
        }
        step={0.1}
        style={inputPct}
      />
    )
}
                  </td>
                );
              }
              )}
            </tr>

{/* DEPRECIATION */}
<tr>
  <td style={left}>Depreciation</td>
  {years.map((y, idx) => {
    const row = rows.find((r) => r.year === y)!;

    return (
      <td key={y} style={cell}>
        {idx === 0 ? (
          <input
            type="number"
            value={row.depreciation}
            onChange={(e) =>
              updateField(y, "depreciation", Number(e.target.value))
            }
            step={500}
            required
            style={inputMoney}
          />
        ) : (
          fmt(model[idx].dep)
        )}
      </td>
    );
  })}
</tr>


{/* INTEREST */}
<tr>
  <td style={left}>Interest</td>
  {years.map((y, idx) => {
    const row = rows.find((r) => r.year === y)!;

    return (
      <td key={y} style={cell}>
        {idx === 0 ? (
          <input
            type="number"
            value={row.interest}
            onChange={(e) =>
              updateField(y, "interest", Number(e.target.value))
            }
            step={100}
            required
            style={inputMoney}
          />
        ) : (
          fmt(model[idx].int)
        )}
      </td>
    );
  })}
</tr>



            {/* TAX */}
            <tr>
              <td style={left}>Tax</td>
              {years.map((y, idx) => {
                const row = rows.find((r) => r.year === y)!;
                return (
                  <td key={y} style={cell}>
                    {idx === 0 ? (
                      <input
                        type="number"
                        value={row.taxes}
                        onChange={(e) =>
                          updateField(y, "taxes", Number(e.target.value))
                        }
                        step={100}
                        style={inputMoney}
                      />
                    ) : (
                      fmt(model[idx].tax)
                    )}
                  </td>
                );
              })}
            </tr>

            {/* TAX RATE */}
            <tr>
              <td style={left}>Tax Rate (%)</td>
              {years.map((y, idx) => {
                const row = rows.find((r) => r.year === y)!;
                return (
                  <td key={y} style={cell}>
                    {idx === 0
                      ? fmt(
                          round1(
                            (row.taxes /
                              Math.max(model[0].EBT, 1)) *
                              100
                          )
                        )
                      : (
                        <input
                          type="number"
                          value={row.taxRatePct ?? 25}
                          onChange={(e) =>
                            updateField(
                              y,
                              "taxRatePct",
                              round1(Number(e.target.value))
                            )
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

        {/* ================= OUTPUT TABLE ================= */}

        <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
          P&amp;L Output
        </h2>

        <PnlOutputTable computed={model} years={years} />

        <div style={{ marginTop: 24 }} />

        <SaveButton
          saving={saving}
          saved={saved}
          error={error}
          onClick={save}
        />
      </div>
    </>
  );
}
