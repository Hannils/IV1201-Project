import './competenceDAOMock'
import { NextFunction, Request, Response } from 'express'
import createMockResponse from '../createMockResponse'
import { patchUserCompetence } from '../../../src/routers/competenceRouter/patchUserCompetence'
describe('Test patch user competence', () => {
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
  test('Should be able patch user competence', async () => {
    const mockRequest = {
      params: {
        personId: 1,
        competenceId: 1,
      },
      body: {
        yearsOfExperience: 2,
      },
    } as unknown as Request
    await patchUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })

  test('Should call 400 on patchUserCompetence', async () => {
    const mockRequest = {
      params: {
        personId: 'hej',
      },
    } as unknown as Request
    await patchUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
  })
})
