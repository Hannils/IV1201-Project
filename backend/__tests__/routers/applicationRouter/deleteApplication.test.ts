import { NextFunction, Request, Response } from 'express'
import './applicationDAOMock'
import createMockResponse from '../createMockResponse'
import { deleteApplication } from '../../../src/routers/applicationRouter/deleteApplication'

describe('deleteApplication', () => {
  let mockResponse: Response
  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation(/*(...params) => console.log('CONSOLE_ERROR: ', ...params)*/)
  })

  beforeEach(() => {
    mockResponse = createMockResponse()
  })
  afterEach(() => jest.clearAllMocks())

  test('should return 200 OK if the application is deleted successfully', async () => {
    const req = {
      params: {
        personId: '1',
      },
      body: {},
    } as unknown as Request
    await deleteApplication(req, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })

  test('should return 400 Bad Request if personId is not a number', async () => {
    const req = {
      params: {
        personId: 'abc',
      },
      body: {},
    } as unknown as Request
    await deleteApplication(req, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })

  test('should return 500 Internal Server Error if there is an error during the deletion process', async () => {
    const req = { params: { personId: '-1' }, body: {} } as unknown as Request

    await deleteApplication(req, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
  })
})
