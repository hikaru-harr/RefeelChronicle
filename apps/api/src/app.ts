import { Hono } from 'hono'

export const app = new Hono()

// ここで直接 /health を定義
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})