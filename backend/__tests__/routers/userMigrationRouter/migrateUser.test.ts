import './userMigrationDAOMock'
import createMockResponse from '../createMockResponse'
import { Request, Response, NextFunction } from 'express'
import { migrateUser } from '../../../src/routers/userMigrationRouter/migrateUser'
import { randomUUID } from 'crypto'

jest.mock('../../../src/routers/userMigrationRouter/index', () => ({
  migrationTokenStore: {
    validateToken: () => true,
    deleteToken: () => true,
    createToken: () => new Promise((resolve) => resolve('A token')),
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

  test('Should be able to migrate a user', async () => {
    const mockRequest = {
      body: {
        token: randomUUID(),
        username: 'NON_EXISTING_PERSON',
        password: 'password',
      },
    } as unknown as Request
    await migrateUser(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should be 400 with existing person', async () => {
    const mockRequest = {
      body: {
        token: randomUUID(),
        username: 'existing person',
        password: 'password',
      },
    } as unknown as Request
    await migrateUser(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.status(400).send).toHaveBeenCalledWith('USER_ALREADY_EXISTS')
  })
})
