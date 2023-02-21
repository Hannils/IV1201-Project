import express from 'express'
import { dropAvailability } from '../../integrations/DAO/availabilityDAO'


/**
 * This method deletes an availability
 * @param req - Request containing params
 * @param res -
 * - `200`: Successful delete
 * - `500`: Database or internal error
 *
 * @returns `void`
 */
export const deleteAvailability: express.RequestHandler = async (req, res) => {
    const personId = Number(req.params.personId)
  
    if (isNaN(personId)) return res.sendStatus(400)
    if (personId !== res.locals.currentUser.personId) return res.sendStatus(403)
  
    try {
      await dropAvailability(Number(req.params.availabilityId))
      res.sendStatus(200)
    } catch (error: any) {
      console.error(error.message)
      return res.sendStatus(500)
    }
  }