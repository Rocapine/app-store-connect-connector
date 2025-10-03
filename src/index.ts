import { Hono } from "hono";

// Define your environment bindings interface
interface Env {
  GOOGLE_CREDENTIALS_JSON?: string;
  BQ_PROJECT_ID: string;
  BQ_DATASET: string;
  BQ_TABLE: string;
}

const app: Hono<{ Bindings: Env }> = new Hono();

import { bigQueryInsert } from "./bigqueryauth";
import { buildBigQueryRow } from "./signedPayload";

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/appstore/webhook", async (c) => {
  try {
    const notification = await c.req.json();
    let notificationType = null;
    let subtype = null;
    let appAppleId = null;
    let bundleId = null;
    let originalTransactionId = null;
    let offerDiscountType = null;
    let notificationUUID = null;
    let price = null;
    let transactionCurrency = null;
    let productId = null;
    let transactionReason = null;
    let purchaseDate = null;
    let expireDate = null;
    let offerPeriod = null;
    let renewalDate = null;
    let renewalPrice = null;
    let renewalCurrency = null;
    let renewalProductId = null;
    let storefront = null;
    let originalPurchaseDate = null;


    // Handle new signedPayload format (App Store Server Notifications V2)
    if (notification.signedPayload) {
      try {
        // Decode the signedPayload JWT (without verification)
        const payloadData = JSON.parse(
          atob(notification.signedPayload.split(".")[1])
        );

        notificationType = payloadData.notificationType;
        subtype = payloadData.subtype;
        appAppleId = payloadData.data?.appAppleId;
        bundleId = payloadData.data?.bundleId;
        notificationUUID = payloadData.notificationUUID;

        // Decode the signedTransactionInfo to get originalTransactionId
        const signedTransactionInfo = payloadData.data?.signedTransactionInfo;
        if (signedTransactionInfo) {
          const transactionPayload = JSON.parse(
            atob(signedTransactionInfo.split(".")[1])
          );
          originalTransactionId = transactionPayload.originalTransactionId;
          offerDiscountType = transactionPayload.offerDiscountType;
          price = transactionPayload.price;
          transactionCurrency = transactionPayload.currency;
          productId = transactionPayload.productId;
          transactionReason = transactionPayload.transactionReason;
          purchaseDate = transactionPayload.purchaseDate;
          expireDate = transactionPayload.expiresDate;
          offerPeriod = transactionPayload.offerPeriod;
          storefront = transactionPayload.storefront;
          originalPurchaseDate = transactionPayload.originalPurchaseDate;

          console.log(
            "Extracted originalTransactionId:",
            originalTransactionId
          );
        }
        const signedRenewalInfo = payloadData.data?.signedRenewalInfo;
        if (signedRenewalInfo) {
          const renewalPayload = JSON.parse(
            atob(signedRenewalInfo.split(".")[1])
          );
          renewalDate = renewalPayload.renewalDate;
          renewalPrice = renewalPayload.renewalPrice;
          renewalCurrency = renewalPayload.currency;
          renewalProductId = renewalPayload.productId;
        }
      } catch (decodeError) {
        console.error("Error decoding signedPayload:", decodeError);
      }
    } 

    const transactionInfo = {
      originalTransactionId: originalTransactionId,
      bundleId: bundleId,
      appAppleId: appAppleId,
      subtype: subtype,
      originalPurchaseDate: new Date(originalPurchaseDate).toISOString(),
      notificationType: notificationType,
      offerDiscountType: offerDiscountType,
      notificationUUID: notificationUUID,
      price: price,
      transactionCurrency: transactionCurrency,
      productId: productId,
      transactionReason: transactionReason,
      purchaseDate: new Date(purchaseDate).toISOString(),
      expireDate: new Date(expireDate).toISOString(),
      offerPeriod: offerPeriod,
      storefront: storefront,
    };

    const renewalInfo = {
      renewalDate: new Date(renewalDate).toISOString(),
      renewalPrice: renewalPrice,
      renewalCurrency: renewalCurrency,
      renewalProductId: renewalProductId,
    };

    const row = buildBigQueryRow(transactionInfo, renewalInfo, notification);
    await bigQueryInsert(
      c.env.BQ_PROJECT_ID,
      c.env.BQ_DATASET,
      c.env.BQ_TABLE,
      JSON.parse(c.env.GOOGLE_CREDENTIALS_JSON || "{}"),
      row
    );
    return c.json({ ok: true });
  } catch (error) {
    console.error("Error inserting into BigQuery:", error);
    return c.json({ ok: false }, 200);
  }
});

app.get("/testconfig", async (c) => {
  // Access environment variables through c.env
  const googleCredentials = c.env.GOOGLE_CREDENTIALS_JSON;

  return c.json({
    googleCredentialsPresent: !!googleCredentials,
    bqProjectId: c.env.BQ_PROJECT_ID,
    bqDataset: c.env.BQ_DATASET,
    bqTable: c.env.BQ_TABLE,
  });
});

app.post("/test", async (c) => {
  let payloadData: any = null;
  try {
    const notification = await c.req.json();
    console.log("Apple Server Notification received:", notification);
    if (notification?.signedPayload) {
      try {
        const payloadData = JSON.parse(
          atob(notification.signedPayload.split(".")[1])
        );
        console.log("Decoded signedPayload:", payloadData);
      } catch (decodeError) {
        console.error("Error decoding signedPayload:", decodeError);
      }
    }
  } catch (error) {
    console.error("Error decoding signedPayload:", error);
  }
  return c.json(payloadData);
});

export default app;
