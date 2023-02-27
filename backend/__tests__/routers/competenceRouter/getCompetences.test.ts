import './competenceDAOMock'
import { NextFunction, Request, Response } from 'express'
import createMockResponse from '../createMockResponse'
import { getCompetences } from '../../../src/routers/competenceRouter/getCompetences'
describe('Test get competences', () => {
  let mockResponse: Response

  beforeEach(() => {
    mockResponse = createMockResponse()
  })
  afterEach(() => jest.clearAllMocks())

  test('Should be able to get all competences', async () => {
    await getCompetences({} as Request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })
})
