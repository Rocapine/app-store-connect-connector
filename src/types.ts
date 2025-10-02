export type TransactionInfo = {
  originalTransactionId: string;
  bundleId: string;
  appAppleId: string;
  subtype: string;
  notificationType: string;
};

export type BigQueryNotificationRow = {
  receivedAt: string;
  originalTransactionId: string;
  notificationType: string;
  subtype: string;
  appAppleId: string;
  "bundleId ": string;
  bundleId: string;
};
