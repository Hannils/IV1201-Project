import express from 'express'
import { z } from 'zod'
import { dropUserCompetence } from '../../integrations/DAO/competenceDAO'

/**
 * This method deletes a user competence
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `competenceId`: Id of the person that the user competence relates to.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */
export const deleteUserCompetence: express.RequestHandler = async (req, res) => {
    const competenceId = Number(req.params.competenceId)
    if (isNaN(competenceId)) return res.sendStatus(400)
    try {
      await dropUserCompetence({
        competenceId,
        personId: res.locals.currentUser.personId,
      })
    } catch (error: any) {
      console.error(error)
      return error instanceof z.ZodError
        ? res.status(400).json(error.issues)
        : res.sendStatus(500)
    }
  
    res.sendStatus(200)
  }