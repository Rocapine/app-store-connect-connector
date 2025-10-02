import { Hono } from "hono";

// Define your environment bindings interface
interface Env {
  GOOGLE_CREDENTIALS_JSON?: string;
  BQ_PROJECT_ID: "rocadata";
  BQ_DATASET: "AppStoreConnect";
  BQ_TABLE: "Notification";
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

        // Decode the signedTransactionInfo to get originalTransactionId
        const signedTransactionInfo = payloadData.data?.signedTransactionInfo;
        if (signedTransactionInfo) {
          const transactionPayload = JSON.parse(
            atob(signedTransactionInfo.split(".")[1])
          );
          originalTransactionId = transactionPayload.originalTransactionId;
          console.log(
            "Extracted originalTransactionId:",
            originalTransactionId
          );
        }
      } catch (decodeError) {
        console.error("Error decoding signedPayload:", decodeError);
      }
    } else {
      // Handle old format (for backward compatibility)
      notificationType = notification.notificationType;
      subtype = notification.subtype;
      appAppleId = notification.data?.appAppleId;
      bundleId = notification.data?.bundleId;

      const signedTransactionInfo = notification.data?.signedTransactionInfo;
      if (signedTransactionInfo) {
        try {
          const payload = JSON.parse(atob(signedTransactionInfo.split(".")[1]));
          originalTransactionId = payload.originalTransactionId;
          console.log(
            "Extracted originalTransactionId:",
            originalTransactionId
          );
        } catch (decodeError) {
          console.error("Error decoding transaction info:", decodeError);
        }
      }
    }
    const TransactionInfo = {
      originalTransactionId: originalTransactionId,
      bundleId: bundleId,
      appAppleId: appAppleId,
      subtype: subtype,
      notificationType: notificationType,
    };

    const row = buildBigQueryRow(TransactionInfo);
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

app.get("/testconfig", (c) => {
  // Access environment variables through c.env
  const googleCredentials = c.env.GOOGLE_CREDENTIALS_JSON;

  return c.json({
    googleCredentialsPresent: !!googleCredentials,
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
