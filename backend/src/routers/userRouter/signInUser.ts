import crypto from 'crypto'
import express from 'express'
import { z } from 'zod'

import { selectPersonByUsername } from '../../integrations/DAO/userDAO'
import * as schemas from '../../util/schemas'
import tokenManager from '../../util/tokenManager'

/**
 * This method signs in a user
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `username`: Username of the user as {@link schemas.usernameSchema}.
 * - - `password`: Password of the user as {@link schemas.passwordSchema}
 * - `params`:
 * - - `none`
 
 * **The response contains the following:**
 * - `Status: 200`: Token as `string` and User as {@link Person}.
 * - `Status: 400`: Wrong password.
 * - `Status: 404`: User not found.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */
export const signInUser: express.RequestHandler = async (req, res) => {
  try {
    const params = z
      .object({ username: schemas.usernameSchema, password: schemas.passwordSchema })
      .parse(req.body)
    const user = await selectPersonByUsername(params.username)
    if (user === null || user === undefined) {
      return res.status(404).send('USER_NOT_FOUND')
    }

    const password = await new Promise<string>((resolve, reject) =>
      crypto.pbkdf2(
        params.password,
        user.salt,
        310000,
        32,
        'sha256',
        (err, hashedPassword) => {
          if (err) reject(err)
          return resolve(hashedPassword.toString('hex'))
        },
      ),
    )

    if (password !== user.password) return res.status(400).send('WRONG_PASSWORD')

    let token: string

    try {
      token = await tokenManager.createToken(user.personId)
    } catch (error: any) {
      console.error(error.message)
      return res.sendStatus(500)
    }

    res.json({
      token,
      user: {
        email: user.email,
        personNumber: user.personNumber,
        username: user.username,
        personId: user.personId,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error(error.message)
    return error instanceof z.ZodError
      ? res.status(400).json(error.issues)
      : res.sendStatus(500)
  }
}
