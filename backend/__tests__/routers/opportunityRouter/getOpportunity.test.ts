import { NextFunction, Request, Response } from 'express'
import './opportunityDAOMock'
import createMockResponse from '../createMockResponse'
import { getOpportunity } from '../../../src/routers/opportunityRouter/getOpportunity'


describe('Test getOpportunities', () => {
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

  test('Should be able to get an opportunity as applicant', async () => {
    const mockRequest = {
        params: {
            opportunityId: '1'
        }
      } as unknown as Request
    await getOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should call 400 on getOpportunity as applicant', async () => {
    const mockRequest = {
        params: {
            opportunityId: 'test'
        }
      } as unknown as Request
    await getOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })

  test('Should call 500 on getOpportunity as applicant', async () => {
    const mockRequest = {
        params: {
            opportunityId: '2'
        }
      } as unknown as Request
    await getOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
  })
})
