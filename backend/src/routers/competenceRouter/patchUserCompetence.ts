import express from 'express'
import { z } from 'zod'
import { updateUserCompetence } from '../../integrations/DAO/competenceDAO'

/**
 * This method patches competenceProfile for specific person
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful update.
 * - `400`: Body does not match validation schema. body will contain {@link ZodIssue}[] with the provided data
 * - `500`: Database or internal error
 * @body
 * - `yearsOfExperience`: number
 * - `competenceId`: number
 * - `personId`: number
 *
 * @returnBody
 * **200**
 * - jasd
 * - asd
 *
 * **500**
 *  - asd
 * - asd
 * @returns `void`
 * @authorization `Applicant`
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