import express from 'express'
import asyncHandler from 'express-async-handler'
import { dropAvailability, insertAvailability, selectAvailabilities, selectAvailability, updateAvailability } from '../integrations/DAO/availabilityDAO'
import isAuthorized from '../util/isAuthorized'
import { AvailabilitySchema } from '../util/Types'
import { z } from 'zod'

const createParams = z.object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date()
})


export const getAvailability: express.RequestHandler = async (req, res) => {
    try {
        const response = await selectAvailability(Number(req.params.avaialbilityId))
        res.json(response)
    } catch (error: any) {
        console.error(error.message)
        return res.sendStatus(500)
    }
}


export const getAvailabilities: express.RequestHandler = async (req, res) => {
    try {
        const response = await selectAvailabilities()
        res.json(response)
    } catch (error: any) {
        console.error(error.message)
        return res.sendStatus(500)
    }
}


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


export const deleteAvailability: express.RequestHandler = async (req, res) => {
    try {
        await dropAvailability(Number(req.params.availabilityId))
    } catch (error: any) {
        console.error(error.message)
        return res.sendStatus(500)
    }
}

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

availabilityRouter.get('/:availabilityId', /* isAuthorized(), */ asyncHandler(getAvailability))
availabilityRouter.get('/', /* isAuthorized(), */ asyncHandler(getAvailabilities))
availabilityRouter.post('/:personId', isAuthorized(), asyncHandler(createAvailability))
availabilityRouter.delete('/:availabilityId', isAuthorized(), asyncHandler(deleteAvailability))
export default availabilityRouter