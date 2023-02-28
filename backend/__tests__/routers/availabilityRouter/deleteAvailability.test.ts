import { NextFunction, Request, Response } from 'express'
import './availabilityDAOMock'
import createMockResponse from '../createMockResponse'
import { deleteAvailability } from '../../../src/routers/availabilityRouter/deleteAvailability'

describe('Test delete availability', () => {
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

  test('Should be able to delete an availability', async () => {
    const mockRequest = {
      params: {
        availabilityId: '1',
      },
    } as unknown as Request
    await deleteAvailability(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })

  test('Should call 400 on deleteAvailability', async () => {
    const mockRequest = {
      params: {
        availabilityId: 'hej',
      },
    } as unknown as Request
    await deleteAvailability(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })
})
