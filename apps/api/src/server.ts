import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app";

const port = 4250;
const hostname = "0.0.0.0";
console.log(`API server starting on http://${hostname}:${port}`);

serve({ port, hostname, fetch: app.fetch });
