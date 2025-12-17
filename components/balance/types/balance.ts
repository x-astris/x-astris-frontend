   /* ============================================================
      BALANCE SHEET TYPES
      - Input fields (user editable, year 1)
      - Ratio fields (DIO/DSO/DPO etc.)
      - Computed fields (all automatically calculated)
   ============================================================ */

   export type BalanceRow = {
   year: number;

   /* -------------------------------
      FIXED ASSETS INPUT FIELDS
   -------------------------------- */
   fixedAssetsInput: number;   // Opening FA (year 1), manual
   investments: number;        // Capex
   depreciationPct: number;    // % per year

   /* -------------------------------
      FINANCING INPUT FIELDS
   -------------------------------- */
   interestRatePct: number;

   /* -------------------------------
      WORKING CAPITAL INPUTS 
      Only valid for YEAR 1
      For year 2+ these are computed
   -------------------------------- */
   inventory: number;               // Year 1 only
   receivables: number;             // Year 1 only
   otherCurrentAssets: number;      // Year 1 only
   payables: number;                // Year 1 only
   otherCurrentLiabilities: number; // Year 1 only

   /* -------------------------------
      EQUITY & DEBT INPUTS
   -------------------------------- */
   equityInput: number;  // Opening equity (year 1)
   longDebt: number;
   shortDebt: number;

   /* -------------------------------
      P&L IMPORT FIELDS
      (Imported and not user editable)
   -------------------------------- */
   depreciationFromPnl?: number;
   interestFromPnl?: number;
   revenueFromPnl?: number;
   };


   /* ============================================================
      KPI RATIO INPUTS (user editable)
      These define working capital behaviour for all years.
   ============================================================ */

   export type RatioRow = {
   year: number;

   dio: number;  // Days Inventory Outstanding
   dso: number;  // Days Sales Outstanding
   dpo: number;  // Days Payables Outstanding

   otherCurrentAssetsPct: number;      // % of revenue
   otherCurrentLiabilitiesPct: number; // % of revenue

   _userEdited?: boolean;
   };


   /* ============================================================
      COMPUTED ROW
      This is the complete calculated balance sheet row.
   ============================================================ */

   export type ComputedRow = BalanceRow & {

   /* -------------------------------
      FIXED ASSETS COMPUTED
   -------------------------------- */
   fixedAssets: number;
   depreciation: number;

   /* -------------------------------
      EQUITY ROLL-FORWARD
   -------------------------------- */
   netResult: number;
   equity: number;

   /* -------------------------------
      INTEREST EXPENSE
   -------------------------------- */
   interest: number;

   /* -------------------------------
      COMPUTED WORKING CAPITAL
      These override the input WC except for year 1.
   -------------------------------- */

   wcInventory: number;
   wcReceivables: number;
   wcOtherCurrentAssets: number;
   wcPayables: number;
   wcOtherCurrentLiabilities: number;

   workingCapital: number;

   /* -------------------------------
      CASH & FINANCING FLOWS
   -------------------------------- */
   cash: number;
   capitalEmployed: number;
   equityDebt: number;

   /* -------------------------------
      Derived KPIs (for display only)
   -------------------------------- */
   dio?: number;
   dso?: number;
   dpo?: number;

   otherCurrentAssetsPct?: number;
   otherCurrentLiabilitiesPct?: number;

   _userEdited?: boolean;
   };
