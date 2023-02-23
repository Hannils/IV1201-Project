import express from 'express'
import { selectPersonById } from '../../integrations/DAO/userDAO'
import { Person } from '../../util/Types'

/**
 * This method gets a user
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `none`
 
 * **The response contains the following:**
 * - `Status: 200`: User as {@link Person}.
 * - `Status: 404`: User not found.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */
export const getUser: express.RequestHandler = async (req, res) => {
    const { personId } = res.locals.currentUser
    try {
      const person = await selectPersonById(personId)
      if (person === null) return res.sendStatus(404)
      res.json(person)
    } catch (e: any) {
      console.error(e.message)
      res.sendStatus(500)
    }
  }