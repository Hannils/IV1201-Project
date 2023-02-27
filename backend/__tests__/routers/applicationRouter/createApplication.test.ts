import { NextFunction, Request, Response } from 'express'
import './applicationDAOMock'
import createMockResponse from '../createMockResponse'
import { createApplication } from '../../../src/routers/applicationRouter/createApplication'

describe('Test create application', () => {
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

  test('Should be able to create an application', async () => {
    const mockRequest = {
      params: {
        opportunityId: 1
      }
    } as unknown as Request
    await createApplication(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })

  test('Should call 400 on createApplication', async () => {
    const mockRequest = {
      params: {
        opportunityId: 'hej'
      }
    } as unknown as Request
    await createApplication(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })
})
