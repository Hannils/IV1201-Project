import express from 'express'

import {
  selectApplicableOpportunity,
  selectOpportunity,
} from '../../integrations/DAO/opportunityDAO'
import { Role } from '../../util/Types'

/**
 * This method gets a specific opportunity
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `opportunityId`: Id of the opportunity.
 
 * **The response contains the following:**
 * - `Status: 200`: Opportunity as {@link Opportunity}.
 * - `Status: 400`: opportunityId not a number.
 * - `Status: 404`: No opportunity found
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`applicant`| `recruiter`]
 */
export const getOpportunity: express.RequestHandler = async (req, res) => {
  try {
    const isApplicant = res.locals.currentUser.role === ('applicant' satisfies Role)
    const opportunityId = Number(req.params.opportunityId)
    if (isNaN(opportunityId)) return res.sendStatus(400)
    const opportunity = isApplicant
      ? await selectApplicableOpportunity(opportunityId)
      : await selectOpportunity(opportunityId)

    if (opportunity === null) return res.sendStatus(404)
    res.json(opportunity)
  } catch (error: any) {
    res.sendStatus(500)
  }
}
