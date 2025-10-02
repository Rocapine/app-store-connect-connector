import type { TransactionInfo, BigQueryNotificationRow,Notification } from "./types";

export function buildBigQueryRow(
  transactionInfo: TransactionInfo, notification: Notification
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
    signedPayload: notification.signedPayload
  };
}
