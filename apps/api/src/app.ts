import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware } from "./core/http/middleware";
import { fileRouter } from "./routes/files";

export type AppEnv = {
	Variables: {
		currentUser: { userId: string } | null;
	};
};

export type CheckedAppEnv = AppEnv & {
	Variables: {
		currentUser: { userId: string };
	};
};

export const app = new Hono<AppEnv>();

app.use("*", cors({ origin: ["http://localhost:4251"] }));

app.use("*", authMiddleware);
app.route("/api/files", fileRouter);

app.get("/health", (c) => {
	return c.json({
		status: "ok",
		timestamp: new Date().toISOString(),
	});
});
