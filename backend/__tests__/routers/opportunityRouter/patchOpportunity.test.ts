import { NextFunction, Request, Response } from 'express'
import './opportunityDAOMock'
import createMockResponse from '../createMockResponse'
import { patchOpportunity } from '../../../src/routers/opportunityRouter/patchOpportunity'


describe('Test patchOpportunity', () => {
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

  test('Should be able to patch an opportunity as applicant', async () => {
    const mockRequest = {
        body: {
            periodStart: '2020-01-01',
            periodEnd: '2020-02-01',
            name: 'name',
            description: 'description'
        },
        params: {
            opportunityId: '1'
        }
    } as unknown as Request
    await patchOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })


  test('Should call 400 on patchOpportunity as applicant', async () => {
    const mockRequest = {
        body: {
            periodStart: '2020-01-01',
            periodEnd: '2020-02-01',
            name: 'name',
            description: 'description'
        },
        params: {
            opportunityId: 'test'
        }
    } as unknown as Request
    await patchOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })


  test('Should call 500 on patchOpportunity as applicant', async () => {
    const mockRequest = {
        body: {
            periodStart: '2020-01-01',
            periodEnd: '2020-02-01',
            name: 'name',
            description: 'description'
        },
        params: {
            opportunityId: '2'
        }
    } as unknown as Request
    await patchOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
  })
})
