import express from 'express'
import { z } from 'zod'

import { selectIncompletePersonByEmail } from '../../integrations/DAO/userDAO'
import { emailSchema } from '../../util/schemas'
import { migrationTokenStore } from '.'

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
  try {
    const { email } = z.object({ email: emailSchema }).parse(req.body)

    const user = await selectIncompletePersonByEmail(email)

    if (user === null) return res.status(404).send('USER_NOT_FOUND')

    const token = await migrationTokenStore.createToken(user.personId)

    console.info(
      `[SENT IN AN EMAIL]: A token was generated: "${token}" for user: ${user.email}`,
    )
    res.sendStatus(200)
  } catch (err: unknown) {
    if (err instanceof Error) console.error(err.message)

    return err instanceof z.ZodError
      ? res.status(400).json(err.issues)
      : res.sendStatus(500)
  }
}
