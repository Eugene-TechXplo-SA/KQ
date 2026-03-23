type RecordMap = {
  users: Array<Record<string, unknown>>;
  ledger: Array<Record<string, unknown>>;
  rewards: Array<Record<string, unknown>>;
  withdrawals: Array<Record<string, unknown>>;
};

export const db: RecordMap = {
  users: [],
  ledger: [],
  rewards: [],
  withdrawals: [],
};
