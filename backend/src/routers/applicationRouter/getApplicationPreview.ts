import express from 'express'
import { ZodError } from 'zod'


/**
 * Express middleware for handling GET requests to retrieve a preview of all applications associated with an opportunity.
 * @function getApplicationPreview
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>}
 * - `200`: Successful. The function responds with a JSON object containing the retrieved application previews.
 * - `400`: Bad Request. If the opportunity ID is not a number, the function responds with a 400 status.
 * - `500`: Internal Server Error. If there is an error while retrieving the application previews, the function logs the error message and responds with a 500 status code.
 * @throws {ZodError} If the data retrieved from the database does not match the expected schema.
 * @description Retrieves an array of application preview objects associated with the opportunity ID specified in the request parameter. 
 */import { selectApplicationPreview } from '../../integrations/DAO/applicationDAO'

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
