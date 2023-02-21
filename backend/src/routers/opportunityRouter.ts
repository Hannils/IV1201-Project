import express from 'express'
import asyncHandler from 'express-async-handler'
import z, { ZodError } from 'zod'

import * as opDAO from '../integrations/DAO/opportunityDAO'
import isAuthorized from '../util/isAuthorized'
import { Role } from '../util/Types'

/**
 * This method gets all opportunities.
 * For applicants only the applicable ones are returned
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of opportunities
 * @authorization `Yes`
 */
const getOpportunities: express.RequestHandler = async (req, res) => {
  try {
    const isApplicant = res.locals.currentUser.role === ('applicant' satisfies Role)
    const response = isApplicant
      ? await opDAO.selectApplicableOpportunities()
      : await opDAO.selectOpportunities()
    res.json(response)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}
/**
 * This method get a single opportunity.
 * Must be applicable for applicant to be able to fetch
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an opportunity object
 * @authorization `Yes`
 */
const getOpportunity: express.RequestHandler = async (req, res) => {
  try {
    const isApplicant = res.locals.currentUser.role === ('applicant' satisfies Role)
    const opportunityId = Number(req.params.opportunityId)
    if (isNaN(opportunityId)) return res.sendStatus(400)
    const opportunity = isApplicant
      ? await opDAO.selectApplicableOpportunity(opportunityId)
      : await opDAO.selectOpportunity(opportunityId)

    if (opportunity === null) return res.sendStatus(404)
    res.json(opportunity)
  } catch (error: any) {
    res.sendStatus(500)
  }
}
/**
 * This method updates a single
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of opportunitys
 * @authorization `Recruiter`
 */
const patchOpportunity: express.RequestHandler = async (req, res) => {
  try {
    const opportunityId = z.number().parse(req.params.opportunityId)
    const { periodStart, periodEnd, name, description } = req.body
    await opDAO.updateOpportunity(
      opportunityId,
      periodStart,
      periodEnd,
      name,
      description,
    )
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
}

/**
 * This method creates a single opportunity
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of opportunitys
 * @authorization `Recruiter`
 */
const createOpportunity: express.RequestHandler = async (req, res) => {
  try {
    const { periodStart, periodEnd, name, description } = req.body
    await opDAO.insertOpportunity(periodStart, periodEnd, name, description)
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
}
/**
 * This method deletes a single opportunity
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of opportunitys
 * @authorization `Recruiter`
 */
const deleteOpportunity: express.RequestHandler = async (req, res) => {
  try {
    const personId = z.number().parse(Number(req.params.personId))
    await opDAO.dropOpportunity(personId)
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
}

const opportunityRouter = express.Router()
opportunityRouter.get('/', asyncHandler(getOpportunities))
opportunityRouter.get('/:opportunityId', asyncHandler(getOpportunity))
opportunityRouter.post(
  '/:opportunityId',
  isAuthorized(['recruiter']),
  asyncHandler(createOpportunity),
)

opportunityRouter.patch(
  '/:opportunityId/',
  isAuthorized(['recruiter']),
  asyncHandler(patchOpportunity),
)
opportunityRouter.delete(
  '/:opportunityId/',
  isAuthorized(['recruiter']),
  asyncHandler(deleteOpportunity),
)

export default opportunityRouter
