import express from 'express'

import { selectCompetenceProfile } from '../../integrations/DAO/competenceDAO'

/**
 * This method gets a competence profile
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `personId`: Id of the person that the competence profile relates to.
 
 * **The response contains the following:**
 * - `Status: 200`: Specified competence profile as {@link CompetenceProfile}.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */
export const getCompetenceProfile: express.RequestHandler = async (req, res) => {
  const personId = Number(req.params.personId)
  if (isNaN(personId)) return res.sendStatus(400)

  try {
    const competenceProfile = await selectCompetenceProfile(personId)
    res.json(competenceProfile)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}
