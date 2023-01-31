import { NextFunction, Request, RequestHandler, Response } from 'express'
import { selectPersonById } from '../integrations/DAO/userDAO'
import tokenStore, { TOKEN_VALIDITY } from './tokenStore'
/**
 * A middleware for checking and verifying a request's authorization token.
 *
 * After this middleware a current user object will be stored in `res.locals`
 * @param req The express request
 * @param res The express response
 * @param next The express next function
 */
async function useAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization
  res.locals.currentUser = null

  if (typeof token === 'string') {
    try {
      const tokenEntry = tokenStore.get(token)
      if (tokenEntry === undefined) throw new Error('invalid token')

      const { personId, expires } = tokenEntry

      if (Date.now() > expires.getTime()) throw new Error('Expired Token')

      const person = await selectPersonById(personId)

      if (person !== null) {
        tokenStore.set(token, {
          personId: person.personId,
          expires: new Date(Date.now() + TOKEN_VALIDITY),
        })
        res.locals.currentUser = { personId: person.personId, role: person.role }
      }
    } catch (e: any) {
      console.error('Invalid token: ', e.message)
    }
  }
  next()
}

export default useAuth
