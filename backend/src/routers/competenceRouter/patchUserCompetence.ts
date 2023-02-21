import express from 'express'
import { z } from 'zod'
import { updateUserCompetence } from '../../integrations/DAO/competenceDAO'

/**
 * This method patches competenceProfile for specific person
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful update.
 * - `400`: Body does not match validation schema. body will contain {@link ZodIssue}[] with the provided data
 * - `500`: Database or internal error
 * @body
 * - `yearsOfExperience`: number
 * - `competenceId`: number
 * - `personId`: number
 *
 * @returnBody
 * **200**
 * - jasd
 * - asd
 *
 * **500**
 *  - asd
 * - asd
 * @returns `void`
 * @authorization `Applicant`
 */

/**
 * Express middleware for handling PATCH requests to update a user's competence profile.
 *
 * @function patchUserCompetence
 * @param req - The HTTP request object, which contains the updated competence data.
 * @param res - The HTTP response object, which is used to send the response status to the client.
 * @returns `void`
 *
 * @description Updates the specified competence profile for the currently logged-in user in the database. If the request body does not match the expected format, the function responds with a 400 status code. If there is an error while updating the competence profile, the function logs the error message and responds with a 500 status code. Otherwise, the function responds with a 200 status code to indicate a successful update.
 *
 * @paramreq.params.competenceId - The ID of the competence to update.
 * @param res.locals.currentUser - An object containing the currently logged-in user's data, including their personId.
 *
 * @requestBody
 *   - `yearsOfExperience` The updated number of years of experience for the specified competence.
 * @responseBody
 *- `200`: Success - The function successfully updates the competence profile for the current user and responds with a 200 status code.
 *- `400`: Bad Request - The request body does not match the expected format, and the function responds with a 400 status code.
 *- `500`: Server Error - The function is unable to update the competence profile due to an internal error.
 * @authorization `Applicant` 
*/

export const patchUserCompetence: express.RequestHandler = async (req, res) => {
    const competenceId = Number(req.params.competenceId)
    const personId = res.locals.currentUser.personId
  
    if (isNaN(competenceId)) return res.sendStatus(400)
  
    try {
      const yearsOfExperience = z.number().parse(req.body.yearsOfExperience)
  
      await updateUserCompetence({ competenceId, personId, yearsOfExperience })
    } catch (error: any) {
      console.error(error)
      return error instanceof z.ZodError
        ? res.status(400).json(error.issues)
        : res.sendStatus(500)
    }
  
    res.sendStatus(200)
  }