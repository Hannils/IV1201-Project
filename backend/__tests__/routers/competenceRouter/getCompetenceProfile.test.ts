import './competenceDAOMock'
import { NextFunction, Request, Response } from 'express'
import { getCompetenceProfile } from '../../../src/routers/competenceRouter/getCompetenceProfile'
import createMockResponse from '../createMockResponse'

describe('Test get competence profile', () => {
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

  test('Should be able to get competence profile', async () => {
    const mockRequest = {
      params: {
        personId: '1',
      },
    } as unknown as Request
    await getCompetenceProfile(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should call 400 on getCompetenceProfile', async () => {
    const mockRequest = {
      params: {
        personId: 'hejhej',
      },
    } as unknown as Request
    await getCompetenceProfile(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })
  test('Should call 500 on getCompetenceProfile', async () => {
    const mockRequest = {
      params: {
        personId: -1,
      },
    } as unknown as Request
    await getCompetenceProfile(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
  })
})
