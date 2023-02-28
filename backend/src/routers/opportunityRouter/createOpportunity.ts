import express from 'express'
import { z } from 'zod'

import { insertOpportunity } from '../../integrations/DAO/opportunityDAO'

/**
 * This method creates an opportunity
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `periodStart`: Start of the period.
 * - - `periodEnd`: End of the period.
 * - - `name`: Name of the opportunity.
 * - - `description`: Description of the opportunity.
 * - `params`:
 * - - `none`.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`recruiter`]
 */
export const createOpportunity: express.RequestHandler = async (req, res) => {
  try {
    const { periodStart, periodEnd, name, description } = req.body
    await insertOpportunity(periodStart, periodEnd, name, description)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
  res.sendStatus(200)
}
