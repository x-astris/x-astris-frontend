export type PnlRow = {
  year: number;

  // resolved yearly values
  revenue: number;
  cogs: number;
  opex: number;
  depreciation: number;
  interest: number;
  taxes: number;

  // forecasting inputs (nullable by design)
  revenueGrowthPct?: number | null;
  cogsPct?: number | null;
  opexPct?: number | null;
  taxRatePct?: number | null;
};
