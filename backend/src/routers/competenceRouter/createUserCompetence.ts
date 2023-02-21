import express from 'express'
import { z } from 'zod'
import { insertUserCompetence } from '../../integrations/DAO/competenceDAO'
import { UserCompetenceSchema } from '../../util/schemas'

/**
 * This method creates a userCompetence for specific person
 * @param req - Request containing body
 * @param res -
 * - `200`: Success
 * - `400`: Body does not match validation schema. body will contain {@link ZodIssue}[] with the provided data
 * - `500`: Database or internal error
 * @body
 * - `competence`
 * - `yearsOfExperience`
 * @returns `void`
 * @authorization `Applicant`
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