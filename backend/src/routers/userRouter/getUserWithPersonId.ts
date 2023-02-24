import express from 'express'

import { selectPersonById } from '../../integrations/DAO/userDAO'

/**
 * This method gets a user with personId as param
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `personId`: Id of the person to get
 
 * **The response contains the following:**
 * - `Status: 200`: User as {@link Person}.
 * - `Status: 400`: PersonId param not a number.
 * - `Status: 404`: User not found.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization [`recruiter`]
 */
export const getUserWithPersonId: express.RequestHandler = async (req, res) => {
  const personId = Number(req.params.personId)

  if (isNaN(personId)) return res.sendStatus(400)

  try {
    const person = await selectPersonById(personId)
    if (person === null) return res.sendStatus(404)
    res.json(person)
  } catch (e: any) {
    console.error(e.message)
    res.sendStatus(500)
  }
}
