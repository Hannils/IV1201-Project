import express from 'express'
import { z } from 'zod'
import { migrationTokenStore } from '.'
import { selectIncompletePersonByEmail } from '../../integrations/DAO/userDAO'
import { emailSchema } from '../../util/schemas'

/**
 * This method generates a token for migrating user
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
  * - - `email`: Email of the migrating user.
 * - `params`:
 * - - `none`.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 404`: User not found by email.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
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