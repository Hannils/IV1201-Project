import express from 'express'
import { selectApplicationStatus } from '../../integrations/DAO/statusDAO'
import { ApplicationStatus } from '../../util/Types'

/**
 * This method gets all applications statuses
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `none`.
 
 * **The response contains the following:**
 * - `Status: 200`: All as {@link ApplicationStatus}[].
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */
export const getApplicationStatuses: express.RequestHandler = async (req, res) => {
    try {
      const applicationStatuses = await selectApplicationStatus()
      res.json(applicationStatuses)
    } catch (error: any) {
      console.error(error.message)
      return res.sendStatus(500)
    }
  }