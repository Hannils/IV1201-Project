import { NextFunction, Request, Response } from 'express'
import './opportunityDAOMock'
import createMockResponse from '../createMockResponse'
import { deleteOpportunity } from '../../../src/routers/opportunityRouter/deleteOpportunity'


describe('Test deleteOpportunity', () => {
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



  test('Should be able to delete an opportunity', async () => {
    const mockRequest = {
        params: {
            opportunityId: '1'
        }
    } as unknown as Request
    await deleteOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })

  test('Should call 400 createOpportunity', async () => {
    const mockRequest = {
        params: {
            opportunityId: 'test'
        }
    } as unknown as Request
    await deleteOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })

  test('Should call 500 createOpportunity', async () => {
    const mockRequest = {
        params: {
            opportunityId: '2'
        }
    } as unknown as Request
    await deleteOpportunity(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
  })
})
