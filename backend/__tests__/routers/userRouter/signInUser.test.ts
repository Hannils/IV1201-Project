import { Response, Request, NextFunction } from 'express'
import './userDAOMock'
import { signInUser } from '../../../src/routers/userRouter/signInUser'
import createMockResponse from '../createMockResponse'

describe('Testing sign in user', () => {
  let mockResponse: Response
  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation(
        () => null /* (...params) => console.log('CONSOLE_ERROR: ', ...params) */,
      )
  })

  beforeEach(() => (mockResponse = createMockResponse()))
  afterEach(() => jest.clearAllMocks())

  test('Should be able to sign in a user', async () => {
    const mockRequest = {
      body: {
        username: 'username',
        password: 'password',
      },
    } as Request

    await signInUser(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should not be able to sign in a user', async () => {
    const mockRequest = {
      body: {
        username: '',
        password: '',
      },
    } as Request

    await signInUser(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
  })
})
