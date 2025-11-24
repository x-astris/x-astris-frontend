export type PnlRow = {
  year: number;
  revenue: number;
  cogs: number;
  opex: number;
  depreciation: number;
  interest: number;
  taxes: number;
  netResult?: number;
};
