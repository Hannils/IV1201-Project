import createMockResponse from '../createMockResponse'
import { Request, Response, NextFunction } from 'express'
import './userDAOMock'
import { createUser } from '../../../src/routers/userRouter/createUser'

describe('Test create user', () => {
  let mockResponse: Response
  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation((...params) => console.log('CONSOLE_ERROR: ', ...params))
  })

  beforeEach(() => (mockResponse = createMockResponse()))
  afterEach(() => jest.clearAllMocks())

  test('Should be able to create a user', async () => {
    const mockRequest = {
      body: {
        username: 'NON_EXISTING_PERSON',
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'test@test.se',
        personNumber: '20010101-0000',
        password: 'password',
      },
    } as Request
    await createUser(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should not be able to create a user with existing username', async () => {
    const mockRequest = {
      body: {
        username: 'hejsername',
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'test@test.se',
        personNumber: '20010101-0000',
        password: 'password',
      },
    } as Request
    await createUser(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.status(400).send).toHaveBeenCalledWith('USER_ALREADY_EXISTS')
  })

  test('Should not be able to create a user, respond with 400', async () => {
    const mockRequest = {
      body: {},
    } as Request
    await createUser(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
  })
})
