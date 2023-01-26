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

/**
 *
 */
async function init() {
  const app = express()
  await initDatabase()

  app.use(express.json())
  app.use(cors({ origin: true }))
  app.use(useAuth)

  app.use('/user', userRouter)

  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server')
  })
  app.listen(process.env.PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${process.env.PORT}`)
  })
}

init()
