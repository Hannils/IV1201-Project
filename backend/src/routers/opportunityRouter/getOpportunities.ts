import express from 'express'
import { selectApplicableOpportunities, selectOpportunities } from '../../integrations/DAO/opportunityDAO'
import { Role } from '../../util/Types'

/**
 * This method gets all opportunities.
 * For applicants only the applicable ones are returned
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of opportunities
 * @authorization `Yes`
 */
export const getOpportunities: express.RequestHandler = async (req, res) => {
    try {
      const isApplicant = res.locals.currentUser.role === ('applicant' satisfies Role)
      const response = isApplicant
        ? await selectApplicableOpportunities()
        : await selectOpportunities()
      res.json(response)
    } catch (error: any) {
      console.error(error.message)
      return res.sendStatus(500)
    }
  }