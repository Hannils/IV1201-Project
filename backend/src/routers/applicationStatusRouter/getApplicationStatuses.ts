import express from 'express'
import { selectApplicationStatus } from '../../integrations/DAO/statusDAO'

/**
 * Express middleware for handling GET requests to retrieve all application statuses.
 * @param  res - Used to send the retrieved application statuses to the client.
 * @returns `void`
 * - `200`: Successful. the function responds with a JSON object containing the retrieved application statuses.
 * - `500`: If there is an error while retrieving the application statuses.
 * @description 
 * Retrieves an array of all application status objects from the database. 
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