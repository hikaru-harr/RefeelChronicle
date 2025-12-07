import { Hono } from 'hono'
import type { DecodedIdToken } from 'firebase-admin/auth'
import { authMiddleware } from './core/http/middleware'

export type AppEnv = {
  Variables: {
    currentUser: DecodedIdToken | null
  }
}

export const app = new Hono<AppEnv>()

app.use("*", authMiddleware)

// ここで直接 /health を定義
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})