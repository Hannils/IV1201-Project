import express from 'express'
import { z } from 'zod'
import { updateOpportunity } from '../../integrations/DAO/opportunityDAO'

/**
 * This method updates a single
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
export const patchOpportunity: express.RequestHandler = async (req, res) => {
    try {
      const opportunityId = z.number().parse(req.params.opportunityId)
      const { periodStart, periodEnd, name, description } = req.body
      await updateOpportunity(
        opportunityId,
        periodStart,
        periodEnd,
        name,
        description,
      )
    } catch (error: any) {
      console.error(error.message)
      return error instanceof z.ZodError
        ? res.status(400).json(error.message)
        : res.sendStatus(500)
    }
  }