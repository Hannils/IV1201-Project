import { NextFunction, Request, Response } from 'express'
import './statusDAOMock'
import createMockResponse from '../createMockResponse'
import { getApplicationStatuses } from '../../../src/routers/applicationStatusRouter/getApplicationStatuses'


describe('Test getApplicationStatuses', () => {
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



  test('Should be able to get application statuses', async () => {
    await getApplicationStatuses({} as Request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })
})
