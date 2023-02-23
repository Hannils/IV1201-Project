import express from 'express'
import { ZodError } from 'zod'
import { selectApplicationPreview } from '../../integrations/DAO/applicationDAO'
import { ApplicationPreview } from '../../util/Types'


/**
 * This method gets a single preview application
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `opportunityId`: Id of the opportunity that the application preview relates to.
 
 * **The response contains the following:**
 *
 * - `Status: 200`: Specified application preview as {@link ApplicationPreview}.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`recruiter`]
 */

export const getApplicationPreview: express.RequestHandler = async (req, res) => {
  const opportunityId = Number(req.params.opportunityId)

  if (isNaN(opportunityId)) return res.sendStatus(400)
  try {
    const applicationPreviews = await selectApplicationPreview(opportunityId)
    res.json(applicationPreviews)
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
}
