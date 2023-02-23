import express from 'express'
import { dateInputFormatter } from '../../util/IntlFormatters'
import { selectAvailabilitiesByPersonId } from '../../integrations/DAO/availabilityDAO'
import { Availability } from '../../util/Types'

/**
 * This method gets gets an availability
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `personId`: Id of the person that the availability relates to.
 
 * **The response contains the following:**
 * - `Status: 200`: Specified availability as {@link Availability}.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`applicant`]
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