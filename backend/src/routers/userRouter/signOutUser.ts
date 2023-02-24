import express from 'express'

import tokenManager from '../../util/tokenManager'

/**
 * This method signs out a user
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
 * - - `none`.
 * - `params`:
 * - - `none`.
 
 * **The response contains the following:**
 * - `Status: 200`: OK.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
 */
export const signOutUser: express.RequestHandler = (req, res) => {
  try {
    const token: string = res.locals.currentToken
    tokenManager.deleteToken(token)
  } catch (error: any) {
    console.error(error.message)
    res.sendStatus(500)
  }
  res.sendStatus(200)
}
