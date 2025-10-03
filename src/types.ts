export type TransactionInfo = {
  originalTransactionId: string;
  bundleId: string;
  appAppleId: string;
  subtype: string;
  notificationType: string;
  offerDiscountType: string;
  notificationUUID: string;
  price: number;
  transactionCurrency: string;
  productId: string;
  transactionReason: string;
  purchaseDate: string;
  expireDate: string;
  offerPeriod: string;
};

export type RenewalInfo = {
  renewalDate: string;
  renewalPrice: number;
  renewalCurrency: string;
  renewalProductId: string;
};

export type Notification = {
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
  price_in_currency: number;
  currency: string;
  productId: string;
  transactionReason: string;
  purchaseDate: string;
  expireDate: string;
  renewalDate: string;
  renewalProductId: string;
  renewalPrice: number;
  renewalCurrency: string;
  offerPeriod: string;
};
