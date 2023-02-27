import express from 'express'
import { z } from 'zod'

import { insertUserCompetence } from '../../integrations/DAO/competenceDAO'
import { UserCompetenceSchema } from '../../util/schemas'

/**
 * This method creates a user competence
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `User competence as {@link @UserCompetence}`.
 * - `params`:
 * - - `none`.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */
export const createUserCompetence: express.RequestHandler = async (req, res) => {
  const personId = res.locals.currentUser.personId

  try {
    const competence = UserCompetenceSchema.parse(req.body)
    await insertUserCompetence(competence, personId)
  } catch (error: any) {
    console.error(error)

    return error instanceof z.ZodError
      ? res.status(400).json(error.issues)
      : res.sendStatus(500)
  }

  res.sendStatus(200)
}
