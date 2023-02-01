import express from 'express'
import asyncHandler from 'express-async-handler'
import crypto from 'crypto'
import { z } from 'zod'
import {
  insertPerson,
  migratePerson,
  selectIncompletePersonByEmail,
  selectPersonByEmail,
  selectPersonById,
  selectPersonByUsername,
} from '../integrations/DAO/userDAO'
import isAuthorized from '../util/isAuthorized'
import { IncompletePerson, Person } from '../util/Types'
import * as schemas from '../util/schemas'
import tokenStore, { TOKEN_VALIDITY } from '../util/tokenManager'

const migrationTokenStore = new Map<string, number>()

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

  migrationTokenStore.set(token, user.personId)

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

  if (migrationTokenStore.get(token) === undefined) return res.sendStatus(404)
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

  const personId = migrationTokenStore.get(data.token)

  if (personId === undefined) {
    return res.sendStatus(404)
  }

  const salt = crypto.randomBytes(16).toString('hex')
  let password: string
  try {
    password = await new Promise<string>((resolve, reject) => {
      crypto.pbkdf2(data.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) reject(err)
        return resolve(hashedPassword.toString('hex'))
      })
    })
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }

  await migratePerson({
    ...data,
    password,
    salt,
    personId,
  })

  const user = await selectPersonById(personId)

  let token: string

  try {
    token = await new Promise<string>((resolve, reject) =>
      crypto.randomBytes(64, (err, key) =>
        err ? reject(err) : resolve(key.toString('hex')),
      ),
    )
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }

  tokenStore.set(token, { personId, expires: new Date(Date.now() + TOKEN_VALIDITY) })

  res.json({ token, user })
}

const userMigrationRouter = express.Router()
userMigrationRouter.get('/token/:token', asyncHandler(validateToken))
userMigrationRouter.post('/token', asyncHandler(generateToken))
userMigrationRouter.put('/', asyncHandler(migrateUser))

export default userMigrationRouter
