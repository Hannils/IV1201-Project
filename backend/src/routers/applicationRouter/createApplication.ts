import express from 'express'
import { ZodError } from 'zod'
import { insertApplication } from '../../integrations/DAO/applicationDAO'

/**
 * This method creates a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns `void`
 * @authorization
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
