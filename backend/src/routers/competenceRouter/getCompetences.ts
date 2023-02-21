import express from 'express'
import { selectCompetence } from '../../integrations/DAO/competenceDAO'

/**
 * This method retrieves all competences
 * @param req - Request
 * @param res -
 * - `200`: Sends Competences as Competence[]
 * - `500`: Database or internal error
 * @returns `void`
 * @authorization none
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