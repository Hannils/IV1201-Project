import express from 'express'
import { z, ZodError } from 'zod'

import { updateApplicationStatus } from '../../integrations/DAO/applicationDAO'

/**
 * This method updates a single applications status
 * @param req - Request containing applicationId and applicationStatus
 * @param res -
 * - `200`: Successful patch. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns `void`
 * @authorization [applicant]
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
