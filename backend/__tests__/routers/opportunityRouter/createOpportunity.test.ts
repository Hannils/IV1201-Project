import { NextFunction, Request, Response } from 'express'
import './opportunityDAOMock'
import createMockResponse from '../createMockResponse'
import { createOpportunity } from '../../../src/routers/opportunityRouter/createOpportunity'


describe('Test createOpportunity', () => {
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



  test('Should be able to create an opportunity', async () => {
    const mockRequest = {
        body: {
            periodStart: '2020-01-01',
            periodEnd: '2020-02-01',
            name: 'test',
            description: 'Description'
        }
    } as Request
    await createOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })

  test('Should call 500 createOpportunity', async () => {
    const mockRequest = {
        body: {
            periodStart: '2020-01-01',
            periodEnd: '2020-02-01',
            name: 'NON_FUNCTIONAL_NAME',
            description: 'Description'
        }
    } as Request
    await createOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
  })
})
