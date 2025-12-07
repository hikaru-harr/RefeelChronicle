import type { Context, Next } from "hono";
import type { AppEnv } from "../../app";
import { auth } from "../../infra/auth/firebase";

type AppContext = Context<AppEnv>

export const authMiddleware = async (c: AppContext, next: Next) => {
    // if(c.req.path === "/health") {
    //     return await next()
    // }
    const authHeader = c.req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401)
    }
    const token = authHeader.slice("Bearer ".length).trim()
    try {
        const decodedToken = await auth.verifyIdToken(token)
        console.log("currentUser", {userId: decodedToken.uid})
        c.set("currentUser", {userId: decodedToken.uid})
        return await next()
    } catch (error) {
        console.error(error)
        return c.json({ error: "Unauthorized" }, 401)
    }
}