import express from 'express'

import { selectApplicationsByPersonId } from '../../integrations/DAO/applicationDAO'

/**
 * This method gets all applications
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `none`.
 
 * **The response contains the following:**
 * - `Status: 200`: All applications as {@link Application}[].
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
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
