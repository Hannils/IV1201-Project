import express from 'express'
import { z } from 'zod'
import { dropOpportunity } from '../../integrations/DAO/opportunityDAO'

/**
 * This method deletes a single opportunity
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of opportunitys
 * @authorization `Recruiter`
 */
export const deleteOpportunity: express.RequestHandler = async (req, res) => {
    try {
      const personId = z.number().parse(Number(req.params.personId))
      await dropOpportunity(personId)
    } catch (error: any) {
      console.error(error.message)
      return error instanceof z.ZodError
        ? res.status(400).json(error.message)
        : res.sendStatus(500)
    }
  }