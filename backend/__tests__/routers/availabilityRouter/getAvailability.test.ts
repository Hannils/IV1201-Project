import { NextFunction, Request, Response } from 'express'
import './availabilityDAOMock'
import createMockResponse from '../createMockResponse'
import { getAvailability } from '../../../src/routers/availabilityRouter/getAvailability'
import { Role } from '../../../src/util/Types'

describe('Test get availability', () => {
  let mockResponse: Response

  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation(/* (...params) => console.log('CONSOLE_ERROR: ', ...params) */)
  })

  beforeEach(() => {
    mockResponse = createMockResponse()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should be able to get an availability', async () => {
    const mockRequest = {
      params: {
        personId: '1',
      },
    } as unknown as Request
    mockResponse.locals.currentUser.role = 'applicant' satisfies Role
    await getAvailability(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should be able to get an availability as recruiter', async () => {
    const mockRequest = {
      params: {
        personId: '-1',
      },
    } as unknown as Request
    mockResponse.locals.currentUser.role = 'recruiter' satisfies Role
    await getAvailability(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should call 400 on deleteAvailability', async () => {
    const mockRequest = {
      params: {
        personId: 'hej',
      },
    } as unknown as Request
    await getAvailability(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })

  test('Should call 403 on deleteAvailability', async () => {
    const mockRequest = {
      params: {
        personId: '2',
      },
    } as unknown as Request
    mockResponse.locals.currentUser.role = 'applicant' satisfies Role
    await getAvailability(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(403)
  })
})
