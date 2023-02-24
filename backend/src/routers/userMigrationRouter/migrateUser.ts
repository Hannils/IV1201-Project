import crypto from 'crypto'
import express from 'express'
import { z } from 'zod'

import { doTransaction } from '../../integrations/DAO/DAO'
import {
  migratePerson,
  selectPersonById,
  selectPersonByUsername,
} from '../../integrations/DAO/userDAO'
import * as schemas from '../../util/schemas'
import tokenManager from '../../util/tokenManager'
import { migrationTokenStore } from '.'

const migrateUserParams = z.object({
  token: z.string().uuid(),
  username: schemas.usernameSchema,
  password: schemas.passwordSchema,
})

/**
 * This method migrates a pre-existing user to new database
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `token`: Migration token for user.
 * - - `username`: New username of the user.
 * - - `password`: New password of the user
 * - `params`:
 * - - `none`.
 
 * **The response contains the following:**
 * - `Status: 200`: Token as `string` and user as {@link Person}.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
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
