import express from 'express'
import asyncHandler from 'express-async-handler'
import isAuthorized from '../util/isAuthorized'
import { ApplicationStatus, Person } from '../util/Types'
import z from 'zod'

const updateParams = z.object({
    personId: z.string(),
    applicationStatus: z.string()
})
/**
 * @swagger
 * /applications:
 *  get:
 *   description: Get all applications
 *  tags:
 *  - Applications
 * responses:
 * 200:
 * description: OK
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 * 403:
 * description: Forbidden
 * 404:
 * description: Not Found
 * 500:
 * description: Internal Server Error
 * 503:
 * description: Service Unavailable
 * 504:
 * description: Gateway Timeout
 * 
 */
const getApplications: express.RequestHandler = async (req, res) => {

}
/**
 * /applications/{personId}:
 * get:
 * description: Get application
 * tags:
 * - Applications
 * parameters:
 * - in: path
 * name: personId
 * schema:
 * type: string
 * required: true
 * description: The person id
 */
const getApplication: express.RequestHandler = async (req, res) => {

}
/**
 * /applications/{personId}:
 * patch:
 * description: Update application
 * tags:
 * - Applications
 * parameters:
 * - in: path
 * name: personId
 * schema:
 * type: string
 * required: true
 * description: The person id
 * - in: body
 * name: application
 * schema:
 * type: object
 * required:
 * - applicationStatus
 * properties:
 * applicationStatus:
 * type: string
 * description: The application status
 * responses:
 * 200:
 * description: OK
 * 400:
 * description: Bad Request
 * 401:
 * description: Unauthorized
 * 403:
 *  description: Forbidden
 * 404:
 *  description: Not Found
 * 500:
 * description: Internal Server Error
 * 503:
 * description: Service Unavailable
 * 504:
 * description: Gateway Timeout
 * 
 */
const updateApplication: express.RequestHandler = async (req, res) => {
  req.params.personId
}

/**
 * /applications/{personId}:  
 * delete:
 * description: Delete application
 * tags:
 * - Applications
 * parameters:
 * - in: path
 * name: personId
 * schema:
 * type: string
 * required: true
 * description: The person id
 */
const insertApplication: express.RequestHandler = async (req, res) => {
    
}
/**
 * /applications/{personId}:
 * delete:
 * description: Delete application
 * tags:
 * - Applications
 * parameters:
 * - in: path
 * name: personId
 * schema:
 * type: string
 * required: true
 * description: The person id
 *
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
