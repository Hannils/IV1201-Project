import express from 'express'
import { ZodError } from 'zod'
import { insertApplication } from '../../integrations/DAO/applicationDAO'

/**
 * This method creates a single application
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`
 * - `params`:
 * - - `opportunityId`: Id of the opportunity that the application relates to.
 
 * **The response contains the following:**
 *
 * - `Status: 200`: OK
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues
 * - `Status: 500`: Internal Server Error
 * @returns `void`
 * @authorization [`applicant`]
 */
export const createApplication: express.RequestHandler = async (req, res) => {
  const { personId } = res.locals.currentUser
  const opportunityId = Number(req.params.opportunityId)
  if (isNaN(opportunityId)) return res.sendStatus(400)
  try {
    await insertApplication(personId, opportunityId)
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
  res.sendStatus(200)
}
