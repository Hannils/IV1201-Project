import express from 'express'
import { ZodError } from 'zod'
import { Application } from '../../util/Types'
import { selectApplicationByPersonAndOpportunity } from '../../integrations/DAO/applicationDAO'

/**
 * This method gets a single application
 * @param req Contains the request data
 * @param res Contains the response data 
 * - `200`: Successful getting of application.
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data or Bad Request default response
 * - `500`: Database or internal error 
 * @requestParams
 * - `opportunityId`: Id of the opportunity that the application is related to
 * @requestBody
 * - `void`
 * @responseBody
 * **200**
 * - `Application`: The retrieved application as {@link Application} 
 * 
 * **400**
 * - `Message`: ZodError message | Bad Request default message
 * 
 * **500**
 * - `Internal Error`: Default 500 Internal error message
 * @returns `void`
 * @authorization `none`
 */
export const getApplication: express.RequestHandler = async (req, res) => {
  const { personId } = res.locals.currentUser
  const opportunityId = Number(req.params.opportunityId)

  if (isNaN(opportunityId)) return res.sendStatus(400)

  try {
    const application = await selectApplicationByPersonAndOpportunity(
      personId,
      opportunityId,
    )
    res.json(application)
  } catch (error: any) {
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
}
