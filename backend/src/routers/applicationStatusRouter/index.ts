import express from 'express'
import asyncHandler from 'express-async-handler'

import { getApplicationStatuses } from './getApplicationStatuses'

const applicationStatusRouter = express.Router()
applicationStatusRouter.get('/', asyncHandler(getApplicationStatuses))

export default applicationStatusRouter
