"use client";

import BalanceSheetTable, {
  BalanceSheetRow,
} from "@/components/balance/ui/BalanceSheetTable";

const EMPTY_ROW = (year: number): BalanceSheetRow => ({
  year,
  fixedAssets: 0,
  wcInventory: 0,
  wcReceivables: 0,
  wcOtherCurrentAssets: 0,
  wcPayables: 0,
  wcOtherCurrentLiabilities: 0,
  workingCapital: 0,
  cash: 0,
  equity: 0,
  longDebt: 0,
  shortDebt: 0,
});

function sanitize(row: Partial<BalanceSheetRow>, year: number): BalanceSheetRow {
  const base = EMPTY_ROW(year);

  return {
    year,
    fixedAssets: row.fixedAssets ?? base.fixedAssets,
    wcInventory: row.wcInventory ?? base.wcInventory,
    wcReceivables: row.wcReceivables ?? base.wcReceivables,
    wcOtherCurrentAssets:
      row.wcOtherCurrentAssets ?? base.wcOtherCurrentAssets,
    wcPayables: row.wcPayables ?? base.wcPayables,
    wcOtherCurrentLiabilities:
      row.wcOtherCurrentLiabilities ?? base.wcOtherCurrentLiabilities,
    workingCapital: row.workingCapital ?? base.workingCapital,
    cash: row.cash ?? base.cash,
    equity: row.equity ?? base.equity,
    longDebt: row.longDebt ?? base.longDebt,
    shortDebt: row.shortDebt ?? base.shortDebt,
  };
}

export default function BalanceOutput({
  rows,
  years,
}: {
  rows: BalanceSheetRow[];
  years: number[];
}) {
  const rowsByYear: Record<number, BalanceSheetRow> = Object.fromEntries(
    rows.map((r) => [r.year, r])
  );

  const normalizedRows: BalanceSheetRow[] = years.map((year) =>
    sanitize(rowsByYear[year] ?? {}, year)
  );

  return (
    <BalanceSheetTable
      rows={normalizedRows}
      years={years}
    />
  );
}
