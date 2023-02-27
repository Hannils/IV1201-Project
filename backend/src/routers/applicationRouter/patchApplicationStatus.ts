import express from 'express'
import { z, ZodError } from 'zod'

import { selectApplication, updateApplicationStatus } from '../../integrations/DAO/applicationDAO'
import { doTransaction } from '../../integrations/DAO/DAO'
import { ApplicationStatusSchema } from '../../util/schemas'

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
    const { newStatusId, oldStatusId } = z
      .object({
        newStatusId: z.number(),
        oldStatusId: z.number(),
      })
      .parse(req.body)
      
      const result = await doTransaction( async () => {
        const application = await selectApplication(applicationId, true)
        if(application === null) return 404
        if(application.status.statusId !== oldStatusId) return 409
        await updateApplicationStatus(applicationId, newStatusId)
        return 200
      })

      return res.sendStatus(result)
      
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
}
