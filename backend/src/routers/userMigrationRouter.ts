import express from 'express'
import asyncHandler from 'express-async-handler'
import crypto from 'crypto'
import { z } from 'zod'
import {
  insertPerson,
  selectIncompletePersonByEmail,
  selectPersonByEmail,
  selectPersonById,
  selectPersonByUsername,
} from '../integrations/DAO/userDAO'
import isAuthorized from '../util/isAuthorized'
import { IncompletePerson, Person } from '../util/Types'
import * as schemas from '../util/schemas'

const tokenStore = new Map<string, number>()

const getTokenParams = z.object({
  email: schemas.emailSchema,
})

const generateToken: express.RequestHandler = async (req, res) => {
  let email: string

  try {
    email = getTokenParams.parse(req.body).email
  } catch (err: unknown) {
    return err instanceof z.ZodError
      ? res.status(400).json(err.issues)
      : res.sendStatus(500) // Should never happen
  }

  console.log('Email', email)

  let user: IncompletePerson | null

  try {
    user = await selectIncompletePersonByEmail(email)
  } catch (error: any) {
    console.error(error.message)
    return res.status(500).send('Database Error')
  }

  if (user === null) return res.status(404).send('USER_NOT_FOUND')

  const token = crypto.randomUUID()

  tokenStore.set(token, user.personId)

  console.info(
    `[SENT IN AN EMAIL]: A token was generated: "${token}" for user: ${user.email}`,
  )

  res.sendStatus(200)
}

const validateTokenParams = z.string().uuid()

const validateToken: express.RequestHandler = async (req, res) => {
  const token = req.params.token

  try {
    validateTokenParams.parse(token)
  } catch (error) {
    return res.sendStatus(400)
  }

  if (tokenStore.get(token) === undefined) return res.sendStatus(404)
  res.sendStatus(200)
}

const migrateUserParams = z.object({
  token: z.string().uuid(),
  username: schemas.usernameSchema,
  password: schemas.passwordSchema,
})

const migrateUser: express.RequestHandler = async (req, res) => {
  let data: z.infer<typeof migrateUserParams>

  try {
    data = migrateUserParams.parse(req.body)
  } catch (err: unknown) {
    return err instanceof z.ZodError
      ? res.status(400).json(err.issues)
      : res.sendStatus(500) // Should never happen
  }

  const personId = tokenStore.get(data.token)

  if (personId === undefined) {
    return res.sendStatus(404)
  }

  

  res.sendStatus(200)
}

const userMigrationRouter = express.Router()
userMigrationRouter.get('/token/:token', asyncHandler(validateToken))
userMigrationRouter.post('/token', asyncHandler(generateToken))
userMigrationRouter.put('/', asyncHandler(migrateUser))

export default userMigrationRouter
