import express from 'express'
import tokenManager from '../../util/tokenManager'

/**
 * This method Signs in an existing user
 * @param req - Request containing body
 * @param res -
 * - `200`: User is successfully signed out
 * - `500`: Database or internal error
 * @returns `void`
 * @authorization `Yes`
 */
export const signOutUser: express.RequestHandler = (req, res) => {
    const token: string = res.locals.currentToken
  
    tokenManager.deleteToken(token)
  
    res.sendStatus(200)
  }