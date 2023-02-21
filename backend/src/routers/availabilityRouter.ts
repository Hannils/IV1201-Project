import express from 'express'
import asyncHandler from 'express-async-handler'
import { z } from 'zod'

import * as avDAO from '../integrations/DAO/availabilityDAO'
import { doTransaction } from '../integrations/DAO/DAO'
import { dateInputFormatter } from '../util/IntlFormatters'
import isAuthorized from '../util/isAuthorized'
import { AvailabilitySchema } from '../util/schemas'

const createParams = z.object({
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
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

  if (isNaN(personId)) return res.sendStatus(400)

  try {
    const response = await avDAO.selectAvailabilitiesByPersonId(personId)

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

/**
 * This method creates a new availability
 * @param req . Request containing params and body
 * @param res -
 * - `200`: Successful creation.
 * - `500`: Database or internal error
 * @returns `void`
 */
export const createAvailability: express.RequestHandler = async (req, res) => {
  const personId = Number(req.params.personId)

  if (isNaN(personId)) return res.sendStatus(400)
  if (personId !== res.locals.currentUser.personId) return res.sendStatus(403)
  try {
    doTransaction(async () => {
      const existingAvailability = await avDAO.selectAvailabilitiesByPersonId(personId)

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

      const availabilityId = await avDAO.insertAvailability(
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
    await avDAO.dropAvailability(Number(req.params.availabilityId))
    res.sendStatus(200)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}

const availabilityRouter = express.Router()

availabilityRouter.get('/:personId', isAuthorized(), asyncHandler(getAvailability))
availabilityRouter.post(
  '/:personId',
  isAuthorized(['applicant']),
  asyncHandler(createAvailability),
)
availabilityRouter.delete(
  '/:availabilityId',
  isAuthorized(['applicant']),
  asyncHandler(deleteAvailability),
)
export default availabilityRouter
