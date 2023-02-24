import express from 'express'
import { z } from 'zod'

import { updateUserCompetence } from '../../integrations/DAO/competenceDAO'

/**
 * This method patches a user competence
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `yearsOfExperience`: the number of years the user competence has as `number`.
 * - `params`:
 * - - `competenceId`: Id of the user competence to patch.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */

export const patchUserCompetence: express.RequestHandler = async (req, res) => {
  const competenceId = Number(req.params.competenceId)
  const personId = res.locals.currentUser.personId

  if (isNaN(competenceId)) return res.sendStatus(400)

  try {
    const yearsOfExperience = z.number().parse(req.body.yearsOfExperience)

    await updateUserCompetence({ competenceId, personId, yearsOfExperience })
  } catch (error: any) {
    console.error(error)
    return error instanceof z.ZodError
      ? res.status(400).json(error.issues)
      : res.sendStatus(500)
  }

  res.sendStatus(200)
}
