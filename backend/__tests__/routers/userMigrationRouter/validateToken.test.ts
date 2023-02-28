import './userMigrationDAOMock'
import createMockResponse from '../createMockResponse'
import { Request, Response, NextFunction } from 'express'
import { validateToken } from '../../../src/routers/userMigrationRouter/validateToken'
import { randomUUID } from 'crypto'

jest.mock('../../../src/routers/userMigrationRouter/index', () => ({
  migrationTokenStore: {
    validateToken: () => true,
  },
}))

describe('Test Validate token', () => {
  let mockResponse: Response

  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation((...params) => console.log('CONSOLE_ERROR: ', ...params))
  })

  beforeEach(() => (mockResponse = createMockResponse()))
  afterEach(() => jest.clearAllMocks())

  test('Should be able to validate a token', async () => {
    const mockRequest = {
      params: {
        token: randomUUID(),
      },
    } as unknown as Request
    await validateToken(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })

  test('Should be 400 with invalid token', async () => {
    const mockRequest = {
      params: {
        token: 'invalid uuid',
      },
    } as unknown as Request
    await validateToken(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })
})
