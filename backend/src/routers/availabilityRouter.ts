import express from 'express'
import asyncHandler from 'express-async-handler'
import { dropAvailability, insertAvailability, selectAvailabilities, selectAvailabilitiesByPersonId, updateAvailability } from '../integrations/DAO/availabilityDAO'
import isAuthorized from '../util/isAuthorized'
import { AvailabilitySchema } from '../util/Types'
import { z } from 'zod'

const createParams = z.object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date()
})

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

    if(isNaN(personId)) return res.sendStatus(400)

    try {
        const response = await selectAvailabilitiesByPersonId(personId)
        res.json(response)
    } catch (error: any) {
        console.error(error.message)
        return res.sendStatus(500)
    }
}

/**
 * This method gets all availabilities
 * @param req - Request
 * @param res -
 * - `200`: Successful get.
 * - `500`: Database or internal error
 * @returns an array of availabilities
 */
export const getAvailabilities: express.RequestHandler = async (req, res) => {
    try {
        const response = await selectAvailabilities()
        res.json(response)
    } catch (error: any) {
        console.error(error.message)
        return res.sendStatus(500)
    }
}

/**
 * This method creates a new availability
 * @param req . Request containing params and body
 * @param res -
 * - `200`: Successful creation.
 * - `500`: Database or internal error
 * @returns `void`
 */
export const createAvailability: express.RequestHandler = async (req, res) => {
    try {
        const dates = createParams.parse(req.body)
        await insertAvailability(Number(req.params.personId), dates.fromDate, dates.toDate)
        res.sendStatus(200)
    } catch (error: any) {
        console.error(error.message)
        return res.sendStatus(500)
    }
}

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
    try {
        await dropAvailability(Number(req.params.availabilityId))
        res.sendStatus(200)
    } catch (error: any) {
        console.error(error.message)
        return res.sendStatus(500)
    }
}


/**
 * This method patches an availability
 * @param req - Request containing body and params
 * @param res -
 * - `200`: Successful patch.
 * - `500`: Database or internal error
 * @returns `void`
 */
export const patchAvailability: express.RequestHandler = async (req, res) => {
    try {
        const dates = createParams.parse(req.body)
        await updateAvailability(Number(req.params.avaialbilityId), dates.fromDate, dates.toDate)
    } catch (error: any) {
        console.error(error.message)
        return res.sendStatus(500)
    }
}



const availabilityRouter = express.Router()

availabilityRouter.get('/:personId', isAuthorized(), asyncHandler(getAvailability))
availabilityRouter.post('/:personId', isAuthorized(), asyncHandler(createAvailability))
availabilityRouter.delete('/:availabilityId', isAuthorized(), asyncHandler(deleteAvailability))
export default availabilityRouter