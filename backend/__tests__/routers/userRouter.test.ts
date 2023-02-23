import request from 'supertest'
import { Request, Response, NextFunction } from 'express'
import { Person } from '../../src/util/Types'
import crypto from 'crypto'
import { createUser } from '../../src/routers/userRouter/createUser'
import { getUser } from '../../src/routers/userRouter/getUser'
import { signInUser } from '../../src/routers/userRouter/signInUser'

jest.mock('../../src/integrations/DAO/userDAO', () => ({
  insertPerson: jest.fn(),
  selectPersonByUsername: jest.fn(async () => {
    const hashedPassword = await new Promise<string>((resolve, reject) =>
      crypto.pbkdf2(
        'password',
        'randomSalt',
        310000,
        32,
        'sha256',
        (err, hashedPassword) => {
          if (err) reject(err)
          return resolve(hashedPassword.toString('hex'))
        },
      ),
    )
    return {
      username: 'username',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'test@test.se',
      role: 'applicant',
      personId: -1,
      personNumber: '20000101-0000',
      password: hashedPassword,
      salt: 'randomSalt',
    } satisfies Person
  }),
  selectPersonById: jest.fn(async (personId) => {
    if (personId === -1) return null
    return {} as Person
  }),
}))

describe('Test all with good parameters on userRouter', () => {
  let mockResponse: Response

  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation((...params) => console.log('CONSOLE_ERROR: ', ...params))
  })

  beforeEach(() => {
    mockResponse = {
      status: jest.fn(() => ({
        json: jest.fn(/* (...params) => console.log('STATUS_JSON', ...params) */),
        send: jest.fn(/* (...params) => console.log('STATUS_SEND', ...params) */),
      })),
      sendStatus: jest.fn(() => null),
      json: jest.fn(() => null),
    } as unknown as Response
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should be able to create a user', async () => {
    const mockRequest = {
      body: {
        username: 'username',
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'test@test.se',
        personNumber: '20000101-0000',
        password: 'password',
      },
    } as Request

    await createUser(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

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

  test('Should be able to get a user', async () => {
    mockResponse.locals = {
      currentUser: { personId: 1 },
    }
    await getUser({} as Request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })
})

describe('Test all with bad parameters on userRouter', () => {
  let mockResponse: Response

  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation((...params) => console.log('CONSOLE_ERROR: ', ...params))
  })

  beforeEach(() => {
    mockResponse = {
      status: jest.fn(() => ({
        json: jest.fn(/* (...params) => console.log('STATUS_JSON', ...params) */),
        send: jest.fn(/* (...params) => console.log('STATUS_SEND', ...params) */),
      })),
      sendStatus: jest.fn(() => null),
      json: jest.fn(() => null),
    } as unknown as Response
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should be 400 on createUser', async () => {
    const mockRequests = [
      {
        body: {},
      },
      {
        body: {
          username: 'username',
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'test@test.se',
          personNumber: '000101-0000', // Bad
          password: 'password',
        },
      },
      {
        body: {
          username: 'username',
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'test.test.se', // Bad
          personNumber: '20000101-0000',
          password: 'password',
        },
      },
      {
        body: {
          username: 'username',
          firstname: 'firstname',
          // lastname: ''
          email: 'test.test.se',
          personNumber: '20000101-0000',
          password: 'password',
        },
      },
    ] as Request[]

    let calledTimes = 0

    for await (const req of mockRequests) {
      await createUser(req, mockResponse, (() => null) as NextFunction)
      calledTimes++
      expect(mockResponse.status).toHaveBeenLastCalledWith(400)
      expect(mockResponse.status).toHaveBeenCalledTimes(calledTimes)
    }
  })

  test('Should not be able to sign in a user', async () => {
    const mockRequest = {
      body: {
        username: 'username',
        password: 'password',
      },
    } as Request

    await signInUser(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should be 404 on getUser (no user in db)', async () => {
    mockResponse.locals = {
      currentUser: { personId: -1 },
    }
    await getUser({} as Request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404)
  })
})
