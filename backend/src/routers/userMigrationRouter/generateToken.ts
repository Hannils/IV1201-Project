import express from 'express'
import { z } from 'zod'
import { migrationTokenStore } from '.'
import { selectIncompletePersonByEmail } from '../../integrations/DAO/userDAO'
import { emailSchema } from '../../util/schemas'

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
export const generateToken: express.RequestHandler = async (req, res) => {
    let email: string
    try {
      email = z.object({email: emailSchema}).parse(req.body).email
    } catch (err: unknown) {
      return err instanceof z.ZodError ? res.status(400).json(err.issues) : res.sendStatus(500) // Should never happen
    }
    try {
      const user = await selectIncompletePersonByEmail(email)
      if (user === null) return res.status(404).send('USER_NOT_FOUND')
      const token = await migrationTokenStore.createToken(user.personId)
      console.info(`[SENT IN AN EMAIL]: A token was generated: "${token}" for user: ${user.email}`,)
      res.sendStatus(200)
    } catch (error: any) {
      console.error(error.message)
      res.sendStatus(500)
    }
  }