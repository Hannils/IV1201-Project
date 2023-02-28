import { NextFunction, Request, Response } from 'express'
import './availabilityDAOMock'
import createMockResponse from '../createMockResponse'
import { createAvailability } from '../../../src/routers/availabilityRouter/createAvailability'

describe('Test create availability', () => {
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

  test('Should be able to create an availability', async () => {
    const mockRequest = {
      body: {
        fromDate: '2020-01-01',
        toDate: '2020-02-01'
      },
      params: {
        personId: '1'
      }
    } as unknown as Request
    createAvailability(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  //test('Should call 400 on createAvailability', async () => {
  //  const mockRequest = {
  //      body: {
  //        fromDate: '2020-01-01',
  //        toDate: '2020-02-01'
  //      },
  //      params: {
  //        personId: 'hej'
  //      }
  //    } as unknown as Request
  //  createAvailability(mockRequest, mockResponse, (() => null) as NextFunction)
  //  expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  //})
//
  //test('Should call 403 on createAvailability', async () => {
  //  const mockRequest = {
  //      body: {
  //        fromDate: '2020-01-01',
  //        toDate: '2020-02-01'
  //      },
  //      params: {
  //        personId: '2'
  //      }
  //    } as unknown as Request
  //  createAvailability(mockRequest, mockResponse, (() => null) as NextFunction)
  //  expect(mockResponse.sendStatus).toHaveBeenCalledWith(403)
  //})
})
