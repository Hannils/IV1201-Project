import express from 'express'
import asyncHandler from 'express-async-handler'

import isAuthorized from '../../util/isAuthorized'
import { createAvailability } from './createAvailability'
import { deleteAvailability } from './deleteAvailability'
import { getAvailability } from './getAvailability'

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
