import express from 'express'

import { selectCompetence } from '../../integrations/DAO/competenceDAO'

/**
 * This method gets all competences
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `none`
 
 * **The response contains the following:**
 * - `Status: 200`: Competences as {@link Competence}[].
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */
export const getCompetences: express.RequestHandler = async (req, res) => {
  try {
    const response = await selectCompetence()
    res.json(response)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}
