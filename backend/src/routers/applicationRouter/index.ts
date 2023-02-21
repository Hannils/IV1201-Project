import express from 'express'
import asyncHandler from 'express-async-handler'

import isAuthorized from '../../util/isAuthorized'
import { createApplication } from './createApplication'
import { deleteApplication } from './deleteApplication'
import { getApplication } from './getApplication'
import { getApplicationPreview } from './getApplicationPreview'
import { getApplications } from './getApplications'
import { patchApplicationStatus } from './patchApplicationStatus'

const applicationRouter = express.Router()
applicationRouter.get('/', asyncHandler(getApplications))
applicationRouter.get('/:opportunityId/', asyncHandler(getApplication))
applicationRouter.get(
  '/preview/:opportunityId',
  isAuthorized(['recruiter']),
  asyncHandler(getApplicationPreview),
)
applicationRouter.post(
  '/:opportunityId/',
  isAuthorized(['applicant']),
  asyncHandler(createApplication),
)

applicationRouter.patch(
  '/status/:applicationId',
  isAuthorized(['recruiter']),
  asyncHandler(patchApplicationStatus),
)
applicationRouter.delete(
  '/:opportunityId/:personId',
  isAuthorized(['applicant', 'recruiter']),
  asyncHandler(deleteApplication),
)

export default applicationRouter
