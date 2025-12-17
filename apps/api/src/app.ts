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

app.use(
	"*",
	cors({
		origin: "*",
		allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use("*", authMiddleware);
app.route("/api/files", fileRouter);

app.get("/health", (c) => {
	return c.json({
		status: "ok",
		timestamp: new Date().toISOString(),
	});
});
