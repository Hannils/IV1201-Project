import express from 'express'
import { selectApplicableOpportunities, selectOpportunities } from '../../integrations/DAO/opportunityDAO'
import { Role } from '../../util/Types'

/**
 * This method gets all opportunities
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `none`.
 
 * **The response contains the following:**
 * - `Status: 200`: `Applicant`: All applicable opportunities. `Recruiter`: All opportunities.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`applicant`| `recruiter`]
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