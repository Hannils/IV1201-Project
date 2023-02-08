import express from 'express'
import asyncHandler from 'express-async-handler'
import isAuthorized from '../util/isAuthorized'
import { ApplicationStatus, Person } from '../util/Types'
import z from 'zod'

const updateParams = z.object({
    personId: z.string(),
    applicationStatus: z.string()
})

const getApplications: express.RequestHandler = async (req, res) => {

}

const updateApplication: express.RequestHandler = async (req, res) => {
  req.params.personId
}

const deleteApplication: express.RequestHandler = async (req, res) => {}

const applicationRouter = express.Router()
applicationRouter.get('/', asyncHandler(getApplications))
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
