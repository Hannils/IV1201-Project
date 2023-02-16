import express, { application } from 'express'
import asyncHandler from 'express-async-handler'
import z, { ZodError } from 'zod'
import { selectOpportunity, selectOpportunities, insertOpportunity, updateOpportunity } from '../integrations/DAO/opportunityDAO'
import isAuthorized from '../util/isAuthorized'

/**
 * This method gets all opportunities
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of opportunities
 * @authorization when the user is not an applicant but a recruiter
 */
const getOpportunities: express.RequestHandler = async (req, res) => {
  try {
    const response = selectOpportunities()
    res.json(response)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}
/**
 * This method get a single opportunity
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an opportunity object
 * @authorization when the user is not an applicant but a recruiter
 */
const getOpportunity: express.RequestHandler = async (req, res) => {
  try {
  //const opportunityId = req.params
  
  const opportunityId = req.params.opportunityId as unknown as number
   const opportunity = await selectOpportunity(opportunityId)
   res.json(opportunity)
  } catch (error: any) {
    return error instanceof ZodError
    ? res.status(400).json(error.message)
    : res.status(500)
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
 * @authorization when the user is the opportunity owner.
 */
const patchOpportunity: express.RequestHandler = async (req, res) => {
  try {
    const opportunityId = z.number().parse(req.params.opportunityId)
    const { periodStart, periodEnd, name, description } = req.body
    await updateOpportunity(opportunityId, periodStart, periodEnd, name, description)
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
 * @authorization
 */
const createOpportunity: express.RequestHandler = async (req, res) => {
  try {
    const { periodStart, periodEnd, name, description } = req.body
    const opportunity = await insertOpportunity(periodStart, periodEnd, name, description)
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
 * @authorization when the user is not an applicant but a recruiter
 */
const deleteOpportunity: express.RequestHandler = async (req, res) => {
  try {
    const personId = z.number().parse(req.params.personId)
    //await dropOpportunity(personId)
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
   isAuthorized(['applicant', 'recruiter']),
   asyncHandler(createOpportunity))

opportunityRouter.patch(
  '/:opportunityId/',
  isAuthorized(['recruiter']),
  asyncHandler(patchOpportunity),
)
opportunityRouter.delete(
  '/:opportunityId/',
  isAuthorized(['applicant', 'recruiter']),
  asyncHandler(deleteOpportunity),
)

export default opportunityRouter
