import express from 'express'
import { ZodError } from 'zod'

import { dropApplication } from '../../integrations/DAO/applicationDAO'

/**
 * This method deletes a single application
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`
 * - `params`:
 * - - `personId`: Id of the person that the application relates to.
 
 * **The response contains the following:**
 *
 * - `Status: 200`: OK
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues
 * - `Status: 500`: Internal Server Error
 * @returns `void`
 * @authorization [`applicant` | `recruiter`]
 */
export const deleteApplication: express.RequestHandler = async (req, res) => {
  const personId = Number(req.params.personId)
  if (isNaN(personId)) return res.sendStatus(400)

  try {
    await dropApplication(personId)
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
  res.sendStatus(200)
}
