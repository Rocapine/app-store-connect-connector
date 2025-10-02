import { getGoogleAccessToken } from "./googleAuth";

export async function bigQueryInsert(
  bigQueryProjectId: string,
  bigQueryDataset: string,
  bigQueryTable: string,
  googleCredentialsJson: Record<string, string>,
  rowJson: Record<string, unknown>
): Promise<void> {
  const accessToken = await getGoogleAccessToken(
    {
      client_email: googleCredentialsJson.client_email,
      private_key: googleCredentialsJson.private_key,
    },
    "https://www.googleapis.com/auth/bigquery.insertdata"
  );

  const endpoint = `https://bigquery.googleapis.com/bigquery/v2/projects/${encodeURIComponent(
    bigQueryProjectId
  )}/datasets/${encodeURIComponent(
    bigQueryDataset
  )}/tables/${encodeURIComponent(bigQueryTable)}/insertAll`;

  const body = {
    kind: "bigquery#tableDataInsertAllRequest",
    skipInvalidRows: true,
    ignoreUnknownValues: true,
    rows: [
      {
        json: rowJson,
      },
    ],
  };

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`BigQuery insert failed: ${resp.status} ${errText}`);
  }
  const result = await resp.json();
  if ((result as any)?.insertErrors) {
  }
}
