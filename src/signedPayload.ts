import type { TransactionInfo } from "./types";



export function buildBigQueryRow( TransactionInfo: TransactionInfo): Record<string, unknown> {
  return {
    receivedAt: new Date().toISOString(),
    // signedTransactionInfo → prefixed with transaction_
    transaction_originalTransactionId: TransactionInfo?.originalTransactionId ?? null,
    transaction_bundleId: TransactionInfo?.bundleId ?? null,
    transaction_appAppleId: TransactionInfo?.appAppleId ?? null,
    transaction_subtype: TransactionInfo?.subtype ?? null,
    transaction_notificationType: TransactionInfo?.notificationType ?? null,
  };
}


