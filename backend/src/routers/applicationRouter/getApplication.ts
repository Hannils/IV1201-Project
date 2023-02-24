import express from 'express'
import { ZodError } from 'zod'

import { selectApplicationByPersonAndOpportunity } from '../../integrations/DAO/applicationDAO'

/**
 * This method gets a single application
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `opportunityId`: Id of the opportunity that the application relates to.
 
 * **The response contains the following:**
 *
 * - `Status: 200`: Specified application as {@link Application}.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */
export const getApplication: express.RequestHandler = async (req, res) => {
  const { personId } = res.locals.currentUser
  const opportunityId = Number(req.params.opportunityId)

  if (isNaN(opportunityId)) return res.sendStatus(400)

  try {
    const application = await selectApplicationByPersonAndOpportunity(
      personId,
      opportunityId,
    )
    res.json(application)
  } catch (error: any) {
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
}
