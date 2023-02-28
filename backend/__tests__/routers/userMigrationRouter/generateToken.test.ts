import './userMigrationDAOMock'
import createMockResponse from '../createMockResponse'
import { Request, Response, NextFunction } from 'express'
import { generateToken } from '../../../src/routers/userMigrationRouter/generateToken'

describe('Test Generate token', () => {
  let mockResponse: Response
  let consoleInfo: any
  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation((...params) => console.log('CONSOLE_ERROR: ', ...params))
    consoleInfo = jest
      .spyOn(console, 'info')
      .mockImplementation((...params) => console.log('CONSOLE_INFO: ', ...params))
  })

  beforeEach(() => (mockResponse = createMockResponse()))
  afterEach(() => jest.clearAllMocks())

  test('Should be able to generate a token', async () => {
    const mockRequest = {
      body: {
        email: 'a-random-email@example.com',
      },
    } as Request
    await generateToken(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(consoleInfo).toHaveBeenCalled()
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })

  test('Should not be able to generate token with complete person', async () => {
    const mockRequest = {
      body: {
        email: 'complete-user@example.com',
      },
    } as Request
    await generateToken(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.status(404).send).toHaveBeenCalledWith('USER_NOT_FOUND')
  })

  test('Should not be able to create a user, respond with 400', async () => {
    const mockRequest = {
      body: {},
    } as Request
    await generateToken(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
  })
})
