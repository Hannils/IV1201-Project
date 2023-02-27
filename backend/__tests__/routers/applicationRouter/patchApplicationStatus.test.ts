import { NextFunction, Request, Response } from 'express'
import './applicationDAOMock'
import createMockResponse from '../createMockResponse'
import { patchApplicationStatus } from '../../../src/routers/applicationRouter/patchApplicationStatus'

describe('Test getApplications', () => {
  let mockResponse: Response

  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation(/*(...params) => console.log('CONSOLE_ERROR: ', ...params)*/)
  })

  beforeEach(() => {
    mockResponse = createMockResponse()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockRequest = {
    params: {
        applicationId: 1
    },
    body: {
        newStatusId: 0,
        oldStatusId: 1
    }
  } as unknown as Request

  test('Should be able to get all applications', async () => {
    await patchApplicationStatus(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })
})
