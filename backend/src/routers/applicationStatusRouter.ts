import express from 'express'
import asyncHandler from 'express-async-handler'

import { selectApplicationStatus } from '../integrations/DAO/statusDAO'

const getApplicationStatuses: express.RequestHandler = async (req, res) => {
  try {
    const applicationStatuses = await selectApplicationStatus()
    res.json(applicationStatuses)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}

const applicationStatusRouter = express.Router()
applicationStatusRouter.get('/', asyncHandler(getApplicationStatuses))

export default applicationStatusRouter
