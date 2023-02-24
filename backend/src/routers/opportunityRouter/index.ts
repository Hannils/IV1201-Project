import express from 'express'
import asyncHandler from 'express-async-handler'

import isAuthorized from '../../util/isAuthorized'
import { createOpportunity } from './createOpportunity'
import { deleteOpportunity } from './deleteOpportunity'
import { getOpportunities } from './getOpportunities'
import { getOpportunity } from './getOpportunity'
import { patchOpportunity } from './patchOpportunity'

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
