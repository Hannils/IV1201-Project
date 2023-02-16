import { RequestHandler } from 'express'

import { Role } from './Types'

/**
 * Checks wether or not a request has access to a specific endpoint
 * @param hasRole A list of roles that can access the endpoint
 * @returns A middleware to check if request can access
 */
function isAuthorized(hasRole?: Array<Role>) {
  const handler: RequestHandler = (req, res, next) => {
    if (res.locals.currentUser === null) return res.sendStatus(401)

    const { role } = res.locals.currentUser

    if (!role) return res.sendStatus(403)
    if (hasRole === undefined) return next()
    if (hasRole.includes(role)) return next()

    return res.sendStatus(403)
  }
  return handler
}

export default isAuthorized
