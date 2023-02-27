import { NextFunction, Request, Response } from 'express'
import './applicationDAOMock'
import createMockResponse from '../createMockResponse'
import { getApplicationPreview } from '../../../src/routers/applicationRouter/getApplicationPreview'

describe('Test getApplicationPreview', () => {
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

  test('Should be able to get an application', async () => {
    const mockRequest = {
      params: {
        opportunityId: 1
      }
    } as unknown as Request
    await getApplicationPreview(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should call 400 on getApplication', async () => {
    const mockRequest = {
      params: {
        opportunityId: 'hej'
      }
    } as unknown as Request
    await getApplicationPreview(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })
})
