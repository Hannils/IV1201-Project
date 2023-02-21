import express from 'express'
import { ZodError } from 'zod'

import { dropApplication } from '../../integrations/DAO/applicationDAO'

/**
 * This method deletes a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful delete.
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns `void`
 * @authorization [applicant]
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
