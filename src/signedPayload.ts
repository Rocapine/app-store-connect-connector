import type { TransactionInfo, BigQueryNotificationRow } from "./types";

export function buildBigQueryRow(
  transactionInfo: TransactionInfo
): BigQueryNotificationRow {
  return {
    receivedAt: new Date().toISOString(),
    originalTransactionId: transactionInfo.originalTransactionId,
    "bundleId ": transactionInfo.bundleId, //TO REMOVE
    bundleId: transactionInfo.bundleId,
    appAppleId: transactionInfo.appAppleId,
    subtype: transactionInfo.subtype,
    notificationType: transactionInfo.notificationType,
  };
}
