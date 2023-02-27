import { NextFunction, Request, Response } from 'express'
import './competenceDAOMock'
import { deleteUserCompetence } from '../../../src/routers/competenceRouter/deleteUserCompetence'
import createMockResponse from '../createMockResponse'

describe('Test deleteUserCompetence', () => {
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

  test('Should be able to delete a user competence', async () => {
    const mockRequest = {
      params: {
        competenceId: '1',
      },
    } as unknown as Request
    await deleteUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })
  test('Should NOT be able to delete a user competence', async () => {
    const mockRequest = {
      params: {
        competenceId: 'hej hej',
      },
    } as unknown as Request
    await deleteUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })
  test('Should NOT be able to delete a user competence', async () => {
    const mockRequest = {
      params: {
        competenceId: '-1',
      },
    } as unknown as Request
    await deleteUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
  })
})
