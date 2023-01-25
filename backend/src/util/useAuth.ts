import { NextFunction, Request, RequestHandler, Response } from 'express'
import admin from 'firebase-admin'

/**
 * A middleware for checking and verifying a request's authorization token.
 *
 * After this middleware a current user object will be stored in `res.locals`
 * @param req The express request
 * @param res The express response
 * @param next The express next function
 */
async function useAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  res.locals.currentUser = null

  if (typeof auth === 'string') {
    try {
      const user = await admin.auth().verifyIdToken(auth)
      res.locals.currentUser = { uid: user.uid, role: user.role }
    } catch (_) {
      console.error('Invalid token')
    }
  }
  next()
}

export default useAuth
