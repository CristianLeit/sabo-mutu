import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { pino } from 'pino'
import { pinoHttp } from 'pino-http'

dotenv.config()

const app = express()
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
})

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: false },
  })
)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id'] || undefined,
  })
)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'sabo-mutu-api', timestamp: new Date().toISOString() })
})

// API versioned routes
app.use('/api/v1', require('./routes'))

const server = app.listen(process.env.PORT || 4000, () => {
  logger.info({ port: process.env.PORT || 4000 }, 'API server started')
})

export default server
