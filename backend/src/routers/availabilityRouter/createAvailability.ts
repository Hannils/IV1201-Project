import express from 'express'
import { z } from 'zod'

import {
  insertAvailability,
  selectAvailabilitiesByPersonId,
} from '../../integrations/DAO/availabilityDAO'
import { doTransaction } from '../../integrations/DAO/DAO'
import { AvailabilitySchema } from '../../util/schemas'

/**
 * This method gets creates an availability
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `fromDate`: Date when the availability begins.
 * - - `toDate`: Date when the availability ends.
 * - `params`:
 * - - `personId`: Id of the person the availability relates to.
 
 * **The response contains the following:**
 * - `Status: 200`: Availability as {@link Availability}.
 * - `Status: 400`: Body does not match validation schema sends ZodError message as array of issues.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`applicant`]
 */
export const createAvailability: express.RequestHandler = async (req, res) => {
    const personId = Number(req.params.personId)
  
    if (isNaN(personId)) return res.sendStatus(400)
    if (personId !== res.locals.currentUser.personId) return res.sendStatus(403)
    try {
      doTransaction(async () => {
        const existingAvailability = await selectAvailabilitiesByPersonId(personId, true)
  
        const data = AvailabilitySchema.omit({ availabilityId: true })
          .refine((data) => data.toDate >= data.fromDate, {
            message: 'End date must be after start date',
            path: ['toDate'],
          })
          .superRefine((data, ctx) => {
            const fromDateMatch = existingAvailability.find(
              ({ fromDate, toDate }) =>
                fromDate <= data.fromDate && data.fromDate <= toDate,
            )
  
            if (fromDateMatch) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Start date is overlapping with period ${fromDateMatch.fromDate.toLocaleDateString()}-${fromDateMatch.toDate.toLocaleDateString()}`,
                path: ['fromDate'],
              })
            }
            const toDateMatch = existingAvailability.find(
              ({ fromDate, toDate }) => fromDate <= data.toDate && data.toDate <= toDate,
            )
  
            if (toDateMatch) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `End date is overlapping with period ${toDateMatch.fromDate.toLocaleDateString()}-${toDateMatch.toDate.toLocaleDateString()}`,
                path: ['toDate'],
              })
            }
  
            const overlapMatch = existingAvailability.find(
              ({ fromDate, toDate }) => data.fromDate <= fromDate && toDate <= data.toDate,
            )
  
            if (overlapMatch) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Range is overlapping with period ${overlapMatch.fromDate.toLocaleDateString()}-${overlapMatch.toDate.toLocaleDateString()}`,
                path: ['fromDate'],
              })
            }
          })
          .parse(req.body)
  
        const availabilityId = await insertAvailability(
          data.personId,
          data.fromDate,
          data.toDate,
        )
  
        res.json(
          AvailabilitySchema.parse({
            ...data,
            availabilityId,
          }),
        )
      })
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err.message)
  
      return err instanceof z.ZodError
        ? res.status(400).json(err.issues)
        : res.sendStatus(500)
    }
  }
