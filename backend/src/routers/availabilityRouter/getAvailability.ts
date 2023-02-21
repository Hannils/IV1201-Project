import express from 'express'
import { dateInputFormatter } from '../../util/IntlFormatters'
import { selectAvailabilitiesByPersonId } from '../../integrations/DAO/availabilityDAO'

/**
 * This method gets a specific availability
 * @param req - Request containing param
 * @param res -
 * - `200`: Successful get. return body will contain Availability as {@link Availability}
 * - `500`: Database or internal error
 * @returns `void`
 */
export const getAvailability: express.RequestHandler = async (req, res) => {
    const personId = Number(req.params.personId)
  
    if (isNaN(personId)) return res.sendStatus(400)
  
    try {
      const response = await selectAvailabilitiesByPersonId(personId)
  
      // Remove the timezone from date (kinda hacky fix but works)
      res.json(
        response.map(({ fromDate, toDate, ...rest }) => ({
          ...rest,
          fromDate: dateInputFormatter.format(fromDate),
          toDate: dateInputFormatter.format(toDate),
        })),
      )
    } catch (error: any) {
      console.error(error.message)
      return res.sendStatus(500)
    }
  }