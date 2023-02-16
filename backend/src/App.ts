import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'

import { initDatabase } from './integrations/DAO/DAO'
import useAuth from './middlewares/useAuth'
import applicationRouter from './routers/applicationRouter'
import competenceRouter from './routers/competenceRouter'
import opportunityRouter from './routers/opportunityRouter'
import userMigrationRouter from './routers/userMigrationRouter'
import userRouter from './routers/userRouter'

dotenv.config()

dotenv.config({
  path: path.resolve(__dirname, '../.env.local'),
})

if (process.env.JEST_WORKER_ID === undefined) {
  init()
}

/**
 * Start Express server. Connect to database and start server.
 * If database connection fails, exit process.
 */
export async function init() {
  console.log('Initializing backend...')
  await initDatabase()

  const app = initServer()

  await new Promise<void>((resolve) => {
    app.listen(process.env.PORT, resolve)
  })
  
  console.log(`[server]: Server is running at https://localhost:${process.env.PORT}`)
}
/**
 * Initialize the server
 */
export function initServer() {
  const app = express()
  app.use(express.json())
  app.use(cors({ origin: true }))
  app.use(useAuth)

  app.use('/user', userRouter)
  app.use('/user-migration', userMigrationRouter)
  app.use('/application', applicationRouter)
  app.use('/competence', competenceRouter)
  app.use('/opportunity', opportunityRouter)
  app.use('/application', applicationRouter)

  app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Express + TypeScript Server')
  })

  return app
}
