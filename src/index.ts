import { Hono } from "hono";

const app = new Hono();

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

export default app;
