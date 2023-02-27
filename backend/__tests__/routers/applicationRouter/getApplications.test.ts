import { NextFunction, Request, Response } from 'express'
import './applicationDAOMock'
import createMockResponse from '../createMockResponse'
import { getApplications } from '../../../src/routers/applicationRouter/getApplications'

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

  test('Should be able to get all applications', async () => {
    await getApplications({} as Request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })
})
