import express from 'express'
import { z } from 'zod'
import { dropOpportunity } from '../../integrations/DAO/opportunityDAO'

/**
 * This method deletes an opportunity
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `opportunityId`: Id of the person that the availability relates to.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`recruiter`]
 */
export const deleteOpportunity: express.RequestHandler = async (req, res) => {
    try {
      const opportunityId = z.number().parse(Number(req.params.opportunity))
      await dropOpportunity(opportunityId)
    } catch (error: any) {
      console.error(error.message)
      return error instanceof z.ZodError
        ? res.status(400).json(error.message)
        : res.sendStatus(500)
    }
  }