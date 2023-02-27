import { Response, Request, NextFunction } from 'express'
import createMockResponse from '../createMockResponse'
import './userDAOMock'
import tokenManager from '../../../src/util/tokenManager'
import { signOutUser } from '../../../src/routers/userRouter/signOutUser'

jest.mock('../../../src/util/tokenManager', () => ({
  deleteToken: jest.fn(),
}))
describe('Sign out test', () => {
  let req: Request
  let res: Response

  beforeEach(() => {
    req = {} as Request
    res = createMockResponse()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should sign out user and send status 200', () => {
    res.locals.currentToken = 'abc123'

    signOutUser(req, res, (() => null) as NextFunction)

    expect(tokenManager.deleteToken).toHaveBeenCalledWith('abc123')

    expect(res.sendStatus).toHaveBeenCalledWith(200)
  })

  //test('should handle error and send status 500', () => {

    //signOutUser(req, res, (() => null) as NextFunction)

    //expect (console.error).toHaveBeenCalledWith(error.message)
    //expect(res.sendStatus).toHaveBeenCalledWith(500)
  //})
})
