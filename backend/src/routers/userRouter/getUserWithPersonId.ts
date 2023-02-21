import express from 'express'
import { selectPersonById } from '../../integrations/DAO/userDAO'

/**
 * This method gets the a user based on a personId
 * @param req - Request containing body
 * @param res -
 * - `200`: Sends `user` as {@link Person} in body
 * - `404`: User not found
 * - `500`: Database or internal error
 * @returns `void`
 * @authorization `Yes`
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
    res.sendStatus(400)
  }
}
