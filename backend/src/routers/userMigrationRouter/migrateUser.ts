import express from 'express'
import { z } from 'zod'
import { migrationTokenStore } from '.'
import tokenManager from '../../util/tokenManager'
import * as schemas from '../../util/schemas'
import crypto from 'crypto'
import {
  migratePerson,
  selectPersonById,
  selectPersonByUsername,
} from '../../integrations/DAO/userDAO'
import { doTransaction } from '../../integrations/DAO/DAO'

const migrateUserParams = z.object({
  token: z.string().uuid(),
  username: schemas.usernameSchema,
  password: schemas.passwordSchema,
})

/**
 * Express middleware for handling POST requests to migrate a user's account to a new authentication system.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns `void`
 *
 * @description
 * Validates the request body using the `migrateUserParams` schema, generates a new password hash for the user, and updates the user's account information in the database.
 *
 * If the migration is successful, the function retrieves the updated user information, generates a new authentication token, and responds with a JSON object containing the token and user information.
 *
 * If the request body does not match the expected schema, the function responds with a 400 status and an array of validation issues.
 *
 * If the provided migration token is not valid, the function responds with a 404 status.
 *
 * If there is an error during the migration process, the function logs the error message and responds with a 500 status code.
 */

export const migrateUser: express.RequestHandler = async (req, res) => {
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
    const result = await doTransaction<boolean>(async () => {
      const alreadyExistingPerson = await selectPersonByUsername(data.username)

      if (alreadyExistingPerson !== null) return false

      await migratePerson({
        ...data,
        password,
        salt,
        personId,
      })
      return true
    })

    if (!result) return res.status(400).send('USER_ALREADY_EXISTS')

    const user = await selectPersonById(personId)

    migrationTokenStore.deleteToken(data.token)

    const token = await tokenManager.createToken(personId)
    res.json({ token, user })
  } catch (error: any) {
    console.error(error.message)
    res.sendStatus(500)
  }
}
