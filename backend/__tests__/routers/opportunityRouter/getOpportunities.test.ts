import { NextFunction, Request, Response } from 'express'
import './opportunityDAOMock'
import createMockResponse from '../createMockResponse'
import { getOpportunities } from '../../../src/routers/opportunityRouter/getOpportunities'


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

  test('Should be able to get all opportunities as applicant', async () => {
    await getOpportunities({} as Request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })
})
