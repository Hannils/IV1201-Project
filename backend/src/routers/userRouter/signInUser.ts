import express from 'express'
import { z } from 'zod'
import * as schemas from '../../util/schemas'
import crypto from 'crypto'
import { selectPersonByUsername } from '../../integrations/DAO/userDAO'
import tokenManager from '../../util/tokenManager'

/**
 * This method Signs in an existing user
 * @param req - Request containing body
 * @param res -
 * - `200`: Sends `token` as `string` & `user` as {@link Person} in body
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 * - `username`: {@link schemas.usernameSchema},
 * - `password`: {@link schemas.passwordSchema},
 * @returns `void`
 * @authorization none
 */
export const signInUser: express.RequestHandler = async (req, res) => {
    try {
      const params = z.object({username: schemas.usernameSchema, password: schemas.passwordSchema}).parse(req.body)
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
    } catch (e: any) {
      console.error(e.message)
      res.sendStatus(400)
    }
  }