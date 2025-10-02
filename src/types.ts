export type TransactionInfo = {
  originalTransactionId: string;
  bundleId: string;
  appAppleId: string;
  subtype: string;
  notificationType: string;
  offerDiscountType: string;
  signedPayload: string;
};

export type BigQueryNotificationRow = {
  receivedAt: string;
  notificationUUID: string;
  originalTransactionId: string;
  notificationType: string;
  subtype: string;
  appAppleId: string;
  bundleId: string;
  offerDiscountType: string;
  signedPayload: string;
};
