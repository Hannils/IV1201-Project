import express from 'express'
import { z } from 'zod'

import { migrationTokenStore } from '.'

/**
 * This method validates a token for migrating user
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
  * - - `none`
 * - `params`:
 * - - `token`: Migration token for user.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 400`: Does not match validation schema. Sends ZodError message.
 * - `Status: 404`: Token not valid.
 * @returns `void`
 * @authorization `none`
 */
export const validateToken: express.RequestHandler = async (req, res) => {
  const token = req.params.token

  try {
    z.string().uuid().parse(token)
  } catch (error) {
    return res.sendStatus(400)
  }

  if (migrationTokenStore.validateToken(token) === null)
    return res.status(404).send('BAD_TOKEN')
  res.sendStatus(200)
}
