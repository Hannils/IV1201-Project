import express from 'express'

import { selectApplicationsByPersonId } from '../../integrations/DAO/applicationDAO'

/**
 * This method gets all applications
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful get.
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of applications
 * @authorization [recruiter]
 */
export const getApplications: express.RequestHandler = async (req, res) => {
  const { personId } = res.locals.currentUser
  try {
    const applications = await selectApplicationsByPersonId(personId)
    res.json(applications)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}
