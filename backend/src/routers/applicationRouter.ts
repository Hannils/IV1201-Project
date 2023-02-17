import express, { application } from 'express'
import asyncHandler from 'express-async-handler'
import z, { ZodError } from 'zod'

import { dropApplication, insertApplication, selectApplication, selectApplications } from '../integrations/DAO/applicationDAO'
import isAuthorized from '../util/isAuthorized'

/**
 * This method gets all applications
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful get. 
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of applications
 * @authorization [recruiter]
 */
const getApplications: express.RequestHandler = async (req, res) => {
  try {
    const response = selectApplications()
    res.json(response)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}
/**
 * This method get a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful get. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an application object
 * @authorization Yes
 */
const getApplication: express.RequestHandler = async (req, res) => {
  try {
    const personId = z.number().parse(req.params)
    const application = await selectApplication(personId)
    res.json(application)
  } catch (error: any) {
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.status(500)
  }
}
/**
 * This method updates a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful patch. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns `void`
 * @authorization [applicant]
 */
//const patchApplication: express.RequestHandler = async (req, res) => {
//  try {
//    const personId = z.number().parse(req.params.personId)
//    const applicationStatus = req.body.applicationStatus
//    await updateApplication(personId, applicationStatus)
//  } catch (error: any) {
//    console.error(error.message)
//    return error instanceof ZodError
//      ? res.status(400).json(error.message)
//      : res.sendStatus(500)
//  }
//  res.sendStatus(200)
//}

/**
 * This method creates a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns `void`
 * @authorization
 */
const createApplication: express.RequestHandler = async (req, res) => {
  try {
    const personId = z.number().parse(req.params.personId)
    const application = await insertApplication(personId)
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
  res.sendStatus(200)
}
/**
 * This method deletes a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful delete.
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns `void`
 * @authorization [applicant]
 */
const deleteApplication: express.RequestHandler = async (req, res) => {
  try {
    const personId = z.number().parse(req.params.personId)
    await dropApplication(personId)
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
  res.sendStatus(200)
}

const applicationRouter = express.Router()
applicationRouter.get('/', asyncHandler(getApplications))
applicationRouter.get('/:opportunityId/:personId', asyncHandler(getApplication))
applicationRouter.post(
  '/:opportunityId/:personId',
  isAuthorized(['applicant', 'recruiter']),
  asyncHandler(createApplication),
)

//applicationRouter.patch(
//  '/:opportunityId/:personId',
//  isAuthorized(['recruiter']),
//  asyncHandler(patchApplication),
//)
applicationRouter.delete(
  '/:opportunityId/:personId',
  isAuthorized(['applicant', 'recruiter']),
  asyncHandler(deleteApplication),
)

export default applicationRouter
