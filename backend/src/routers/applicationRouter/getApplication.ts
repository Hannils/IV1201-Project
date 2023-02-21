import express from 'express'
import { ZodError } from 'zod'

import { selectApplicationByPersonAndOpportunity } from '../../integrations/DAO/applicationDAO'

/**
 * This method get a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful get. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an application object
 * @authorization Yes
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
