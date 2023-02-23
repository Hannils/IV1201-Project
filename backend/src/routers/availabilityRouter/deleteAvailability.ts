import express from 'express'
import { dropAvailability } from '../../integrations/DAO/availabilityDAO'


/**
 * This method gets deletes an availability
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `availabilityId`: Id of the availability to delete
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`applicant`]
 */
export const deleteAvailability: express.RequestHandler = async (req, res) => {
  const personId = res.locals.currentUser.personId
  
    try {
      await dropAvailability(Number(req.params.availabilityId))
      res.sendStatus(200)
    } catch (error: any) {
      console.error(error.message)
      return res.sendStatus(500)
    }
  }