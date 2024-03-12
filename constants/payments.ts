export enum PayoutRequestStatus {
  AVAILABLE = 'available',
  DECLINED = 'declined',
  PAID = 'paid',
  PENDING = 'pending',
}

export enum Report {
  CONNECT = 'connect',
  OWNER = 'owner',
}

export const REPORT_TYPES = {
  [Report.CONNECT]: 'connected_account_balance_change_from_activity.itemized.1',
  [Report.OWNER]: 'balance_change_from_activity.itemized.1',
};

export const MIN_PAYOUT_AMOUNT = 10000;
