import express from 'express'
import asyncHandler from 'express-async-handler'
import z from 'zod'

import isAuthorized from '../util/isAuthorized'
import { ApplicationStatus, Person } from '../util/Types'

const updateParams = z.object({
  personId: z.string(),
  applicationStatus: z.string(),
})
/**
 * This method gets all applications
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of applications
 * @authorization when the user is not an applicant but a recruiter
 */
const getApplications: express.RequestHandler = async (req, res) => {}
/**
 * This method get a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an application object
 * @authorization when the user is not an applicant but a recruiter
 */
const getApplication: express.RequestHandler = async (req, res) => {}
/**
 * This method updates a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of applications
 * @authorization when the user is the application owner.
 */
const updateApplication: express.RequestHandler = async (req, res) => {
  req.params.personId
}

/**
 * This method inserts a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of applications
 * @authorization
 */
const insertApplication: express.RequestHandler = async (req, res) => {}
/**
 * This method deletes a single application
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful creation. return body will contain
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 *
 * @returns an array of applications
 * @authorization when the user is not an applicant but a recruiter
 */
const deleteApplication: express.RequestHandler = async (req, res) => {}

const applicationRouter = express.Router()
applicationRouter.get('/', asyncHandler(getApplications))
applicationRouter.get('/:id', asyncHandler(getApplication))

applicationRouter.patch(
  '/:personId/',
  isAuthorized(['recruiter']),
  asyncHandler(updateApplication),
)
applicationRouter.delete(
  '/:personId/',
  isAuthorized(['applicant', 'recruiter']),
  asyncHandler(deleteApplication),
)

export default applicationRouter
