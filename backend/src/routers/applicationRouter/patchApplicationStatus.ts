import express from 'express'
import { z, ZodError } from 'zod'

import { updateApplicationStatus } from '../../integrations/DAO/applicationDAO'

/**
 * This method patches an application
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`
 * - `params`:
 * - - `applicationId`: Id of the application to patch.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`recruiter`]
 */
export const patchApplicationStatus: express.RequestHandler = async (req, res) => {
  const applicationId = Number(req.params.applicationId)
  if (isNaN(applicationId)) return res.sendStatus(400)
  try {
    const { statusId } = z
      .object({
        statusId: z.number(),
      })
      .parse(req.body)
    await updateApplicationStatus(applicationId, statusId)
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
  res.sendStatus(200)
}
