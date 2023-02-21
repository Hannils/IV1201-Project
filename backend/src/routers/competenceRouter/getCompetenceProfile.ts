import express from 'express'
import { selectCompetenceProfile } from '../../integrations/DAO/competenceDAO'

/**
 * This method retrieves competenceProfile for specific person
 * @param req - Request containing `personId` as number
 * @param res -
 * - `200`: sends `competenceProfile` as {@link UserCompetenceSchema}
 * - `500`: Database or internal error
 * @returns `void`
 * @authorization `[Applicant | Recruiter]`
 */
export const getCompetenceProfile: express.RequestHandler = async (req, res) => {
    try {
      const competenceProfile = await selectCompetenceProfile(
        Number(req.params.personId),
      )
      if (competenceProfile === null || competenceProfile === undefined) res.sendStatus(400)
      res.json(competenceProfile)
    } catch (error: any) {
      console.error(error.message)
      return res.sendStatus(500)
    }
  }