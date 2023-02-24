import express from 'express'
import { z } from 'zod'
import { updateOpportunity } from '../../integrations/DAO/opportunityDAO'

/**
 * This method patches an opportunity
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
  * - - `periodStart`: Start of the period.
 * - - `periodEnd`: End of the period.
 * - - `name`: Name of the opportunity.
 * - - `description`: Description of the opportunity.
 * - `params`:
 * - - `opportunityId`: Id of the opportunity to patch.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`recruiter`]
 */
export const patchOpportunity: express.RequestHandler = async (req, res) => {
    try {
      const opportunityId = Number(req.params.opportunityId)
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
    res.sendStatus(200)
  }