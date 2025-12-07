import { Hono } from 'hono'
import { authMiddleware } from './core/http/middleware'

export type AppEnv = {
  Variables: {
    currentUser: { userId: string } | null
  }
}

export const app = new Hono<AppEnv>()

app.use("*", authMiddleware)

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})