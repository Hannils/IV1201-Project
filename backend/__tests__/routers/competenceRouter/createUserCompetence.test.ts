import { NextFunction, Request, Response } from 'express'
import './competenceDAOMock'
import { createUserCompetence } from '../../../src/routers/competenceRouter/createUserCompetence'
import { UserCompetence } from '../../../src/util/Types'
import createMockResponse from '../createMockResponse'

describe('Test create user competence', () => {
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

  test('Should be able to create a user competence', async () => {
    const mockRequest = {
      body: {
        competence: {
          competenceId: 1,
          name: 'test',
        },
        yearsOfExperience: 1,
      } satisfies UserCompetence,
    } as unknown as Request
    await createUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })

  test('Should call 400 on createUserCompetence', async () => {
    const mockRequest = {
      body: {},
    } as Request
    await createUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.status).toHaveBeenCalledWith(400)
  })
})
