import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'

import userRouter from './routers/userRouter'
import useAuth from './util/useAuth'
import path from 'path'

import { initDatabase } from './integrations/DAO/DAO'

dotenv.config()

dotenv.config({
  path: path.resolve(__dirname, '../.env.local'),
})

init()

/**
 * Start Express server. Connect to database and start server. 
 * If database connection fails, exit process. 
 */
async function init() {
  await initDatabase()

  const app = initServer()

  app.listen(process.env.PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${process.env.PORT}`)
  })
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

  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server')
  })

  return app
}
