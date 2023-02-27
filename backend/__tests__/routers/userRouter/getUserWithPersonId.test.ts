import createMockResponse from '../createMockResponse'
import { Request, Response, NextFunction } from 'express'
import './userDAOMock'
import { getUserWithPersonId } from '../../../src/routers/userRouter/getUserWithPersonId'

describe('Get user with personId tests', () => {
  let mockResponse: Response

  beforeEach(() => (mockResponse = createMockResponse()))
  afterEach(() => jest.clearAllMocks())

  test('Should be 404 on getUser', async () => {
    const request = {
      params: {
        personId: '-1',
      },
    } as unknown as Request

    await getUserWithPersonId(request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404)
  })

  test('Should be successful getUser', async () => {
    const request = {
      params: {
        personId: '1',
      },
    } as unknown as Request
    await getUserWithPersonId(request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).not.toHaveBeenCalled()
    expect(mockResponse.status).not.toHaveBeenCalled()
    expect(mockResponse.json).toHaveBeenCalled()
  })
})
