import express from 'express'
import { ZodError } from 'zod'

import { dropApplication } from '../../integrations/DAO/applicationDAO'

/**
 * This method deletes a single application
 * @param req Contains the request data
 * @param res Contains the response data 
 * - `200`: Successful deletion of application.
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error 
 * @requestParams
 * - `personId`: Id of the person that the application is related to
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
