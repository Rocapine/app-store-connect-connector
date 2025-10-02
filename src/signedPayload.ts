import type { TransactionInfo, BigQueryNotificationRow,Notification,RenewalInfo } from "./types";

export function buildBigQueryRow(
  transactionInfo: TransactionInfo,renewalInfo: RenewalInfo, notification: Notification
): BigQueryNotificationRow {
  return {
    receivedAt: new Date().toISOString(),
    originalTransactionId: transactionInfo.originalTransactionId,
    notificationUUID: transactionInfo.notificationUUID,
    bundleId: transactionInfo.bundleId,
    appAppleId: transactionInfo.appAppleId,
    subtype: transactionInfo.subtype,
    notificationType: transactionInfo.notificationType,
    offerDiscountType: transactionInfo.offerDiscountType,
    signedPayload: notification.signedPayload,
    price_in_currency: transactionInfo.price,
    currency: transactionInfo.transactionCurrency,
    productID: transactionInfo.productID,
    transactionReason: transactionInfo.transactionReason,
    purchaseDate: transactionInfo.purchaseDate,
    expireDate: transactionInfo.expireDate,
    renewalDate: renewalInfo.renewalDate,
    renewalPrice: renewalInfo.renewalPrice,
    renewalCurrency: renewalInfo.renewalCurrency,
    offerPeriod: transactionInfo.offerPeriod,
  };
}
