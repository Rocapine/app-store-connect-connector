import { Hono } from "hono";

// Define your environment bindings interface
interface Env {
  GOOGLE_CREDENTIALS_JSON?: string;
}

const app: Hono<{ Bindings: Env }> = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/appstore/webhook", async (c) => {
  try {
    const body = await c.req.json();
    console.log(body);
    return c.text("Webhook received!");
  } catch (error) {
    console.error(error);
    return c.text("Error receiving webhook!");
  }
});

app.get("/testconfig", (c) => {
  // Access environment variables through c.env
  const googleCredentials = c.env.GOOGLE_CREDENTIALS_JSON;

  return c.json({
    googleCredentialsPresent: !!googleCredentials,
  });
});

export default app;
