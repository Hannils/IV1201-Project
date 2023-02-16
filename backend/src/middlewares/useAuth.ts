import { NextFunction, Request, RequestHandler, Response } from 'express'

import { selectPersonById } from '../integrations/DAO/userDAO'
import tokenManager from '../util/tokenManager'

/**
 * A middleware for checking and verifying a request's authorization token.
 * After this middleware a current user object will be stored in `res.locals`
 * @param req The express request as {@link Request}
 * @param res The express response as {@link Response}
 * @param next The express next function as {@link NextFunction}
 * @returns `void`
 * @requires Database
 */
async function useAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization
  res.locals.currentUser = null

  if (typeof token === 'string') {
    try {
      const personId = tokenManager.validateToken(token)
      if (personId === null) throw new Error('invalid token')

      const person = await selectPersonById(personId)

      if (person !== null) {
        res.locals.currentToken = token
        res.locals.currentUser = { personId: person.personId, role: person.role }
      }
    } catch (e: any) {
      console.error(e.message)
    }
  }
  next()
}

export default useAuth
