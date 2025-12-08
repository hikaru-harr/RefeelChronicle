import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app";

const port = 4250;
console.log(`API server starting on http://localhost:${port}`);

serve({ port, fetch: app.fetch });
