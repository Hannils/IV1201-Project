import express from 'express'
import { selectApplicableOpportunity, selectOpportunity } from '../../integrations/DAO/opportunityDAO'
import { Role } from '../../util/Types'


/**
 * This method get a single opportunity.
 * Must be applicable for applicant to be able to fetch
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an opportunity object
 * @authorization `Yes`
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