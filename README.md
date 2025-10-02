```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

### Setup: Cloudflare Worker secrets

Set the following secrets (values from your Google service account and BigQuery target):

```bash
wrangler secret put GOOGLE_CREDENTIALS_JSON # paste full contents of your credentials.json
wrangler secret put BQ_PROJECT_ID
wrangler secret put BQ_DATASET
wrangler secret put BQ_TABLE
```

Notes:
- Paste the full `credentials.json` content; newlines are handled automatically.
- The service account needs the role: BigQuery Data Editor on the target dataset (or equivalent insert permission).

### BigQuery table schema

Create a table with at least these columns:

- `payload` RECORD/JSON: stores the decoded webhook including `decodedTransactionInfo` and `decodedRenewalInfo`.
- `receivedAt` TIMESTAMP: server-side receipt time.

Example DDL (standard SQL):

```sql
CREATE TABLE `YOUR_PROJECT.YOUR_DATASET.appstore_webhooks` (
  payload JSON,
  receivedAt TIMESTAMP
);
```

Then set `BQ_TABLE=appstore_webhooks` (or your chosen name).

### Webhook endpoint

- Path: `/appstore/webhook`
- Accepts the ASSN v2 body. The code supports either:
  - `{ signedPayload: string }` (normal production payload)
  - or a pre-decoded object with `notificationType` (for local testing)

The worker decodes:
- Outer ASSN JWT payload.
- `data.signedTransactionInfo` JWT payload.
- `data.signedRenewalInfo` JWT payload.

Then it inserts one row to BigQuery with JSON `payload` and `receivedAt` timestamp.

### Verification

This sample decodes without signature verification. If you need to verify:
- Verify outer `signedPayload` signature using Apple’s JWKS for ASSN v2.
- Verify nested `signedTransactionInfo` and `signedRenewalInfo` likewise.

Cloudflare Workers have WebCrypto; you can implement JWS verification with Apple JWKS fetch and `crypto.subtle.verify`.
