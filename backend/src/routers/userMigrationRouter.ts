import crypto from 'crypto'
import express from 'express'
import asyncHandler from 'express-async-handler'
import { z } from 'zod'

import * as userDAO from '../integrations/DAO/userDAO'
import * as schemas from '../util/schemas'
import tokenManager, { TokenManager } from '../util/tokenManager'

/**
 * Create the token store. Generate uuids and keep them valid for 10 minuts
 */
const migrationTokenStore = new TokenManager(1000 * 60 * 10, crypto.randomUUID)

const getTokenParams = z.object({
  email: schemas.emailSchema,
})
/**
 * This method Signs in an existing user
 * @param req - Request containing body
 * @param res -
 * - `200`: Sends `token` as `string` & `user` as {@link Person} in body
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 * - `email`: {@link schemas.usernameSchema},
 *
 * @responseBody
 *
 * @returns `void`
 * @authorization none
 */
const generateToken: express.RequestHandler = async (req, res) => {
  let email: string

  try {
    email = getTokenParams.parse(req.body).email
  } catch (err: unknown) {
    return err instanceof z.ZodError
      ? res.status(400).json(err.issues)
      : res.sendStatus(500) // Should never happen
  }

  try {
    const user = await userDAO.selectIncompletePersonByEmail(email)
    if (user === null) return res.status(404).send('USER_NOT_FOUND')

    const token = await migrationTokenStore.createToken(user.personId)
    console.info(
      `[SENT IN AN EMAIL]: A token was generated: "${token}" for user: ${user.email}`,
    )

    res.sendStatus(200)
  } catch (error: any) {
    console.error(error.message)
    res.sendStatus(500)
  }
}

const validateTokenParams = z.string().uuid()

const validateToken: express.RequestHandler = async (req, res) => {
  const token = req.params.token

  try {
    validateTokenParams.parse(token)
  } catch (error) {
    return res.sendStatus(400)
  }

  if (migrationTokenStore.validateToken(token) === null) return res.sendStatus(404)
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

  const personId = migrationTokenStore.validateToken(data.token)

  if (personId === null) return res.sendStatus(404)

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

  try {
    await userDAO.migratePerson({
      ...data,
      password,
      salt,
      personId,
    })

    const user = await userDAO.selectPersonById(personId)

    migrationTokenStore.deleteToken(data.token)

    const token = await tokenManager.createToken(personId)
    res.json({ token, user })
  } catch (error: any) {
    console.error(error.message)
    res.sendStatus(500)
  }
}

const userMigrationRouter = express.Router()
userMigrationRouter.get('/token/:token', asyncHandler(validateToken))
userMigrationRouter.post('/token', asyncHandler(generateToken))
userMigrationRouter.put('/', asyncHandler(migrateUser))

export default userMigrationRouter
