import express from 'express'
import { ZodError } from 'zod'
import { insertApplication } from '../../integrations/DAO/applicationDAO'

/**
 * This method creates a single application
 * @param req Contains the request data
 * @param res Contains the response data 
 * - `200`: Successful creation of application.
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error 
 * @requestParams
 * - `opportunityId`: Id of the opportunity that the application is related to
 * @requestBody
 * - `void`
 * @responseBody
 * **200**
 * - `OK`: Default 200 OK message
 * 
 * **400**
 * - `Message`: ZodError message
 * 
 * **500**
 * - `Internal Error`: Default 500 Internal error message
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
