import createMockResponse from '../createMockResponse'
import { Request, Response, NextFunction } from 'express'
import './userDAOMock'
import { getUser } from '../../../src/routers/userRouter/getUser'

describe('Get user tests', () => {
  let mockResponse: Response

  beforeEach(() => (mockResponse = createMockResponse()))
  afterEach(() => jest.clearAllMocks())

  test('Should be 404 on getUser', async () => {
    mockResponse.locals = {
      currentUser: { personId: -1 },
    }
    await getUser({} as Request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404)
  })

  test('Should be successful getUser', async () => {
    mockResponse.locals = {
      currentUser: { personId: 1 },
    }
    await getUser({} as Request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).not.toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalled()
  })
})
