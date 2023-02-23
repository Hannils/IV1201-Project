import { Request, Response, NextFunction } from 'express'
import { createUserCompetence } from '../../src/routers/competenceRouter/createUserCompetence'
import { deleteUserCompetence } from '../../src/routers/competenceRouter/deleteUserCompetence'
import { getCompetenceProfile } from '../../src/routers/competenceRouter/getCompetenceProfile'
import { getCompetences } from '../../src/routers/competenceRouter/getCompetences'
import { patchUserCompetence } from '../../src/routers/competenceRouter/patchUserCompetence'
import { Competence, CompetenceProfile } from '../../src/util/Types'

jest.mock('../../src/integrations/DAO/competenceDAO', () => ({
  dropUserCompetence: jest.fn(),
  insertUserCompetence: jest.fn(),
  selectCompetence: jest.fn(async () => {
    return [{}] as Competence[]
  }),
  selectCompetenceProfile: jest.fn(async (personId) => {
    if (personId === -1) return null
    return [{}] as CompetenceProfile[]
  }),
  updateUserCompetence: jest.fn(),
}))

describe('Test all with good parameters on competenceRouter', () => {
  let mockResponse: Response

  beforeAll(() => {
    jest
      .spyOn(console, 'error')
      .mockImplementation(/*(...params) => console.log('CONSOLE_ERROR: ', ...params)*/)
  })

  beforeEach(() => {
    mockResponse = {
      status: jest.fn(() => ({
        json: jest.fn((...params) => console.log('STATUS_JSON', ...params)),
        send: jest.fn((...params) => console.log('STATUS_SEND', ...params)),
      })),
      sendStatus: jest.fn(() => null),
      json: jest.fn(() => null),
    } as unknown as Response
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should be able to get all competences', async () => {
    await getCompetences({} as Request, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should be able to get competence profile', async () => {
    const mockRequest = {
        params: {
            personId: 1
        },
    } as unknown as Request
    await getCompetenceProfile(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.json).toHaveBeenCalled()
  })

  test('Should be able to create a user competence', async () => {
    const mockRequest = {
        body: {
            competence: {
                competenceId: 1,
                name: "test"
            },
            yearsOfExperience: 1
        },
        params: {
            personId: 1
        }
    } as unknown as Request
    await createUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })


  test('Should be able to delete a user competence', async () => {
    const mockRequest = {
        params: {
            personId: 1,
            competenceId: 1
        }
    } as unknown as Request
    await deleteUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })


  test('Should be able patch user competence', async () => {
    const mockRequest = {
        params: {
            personId: 1,
            competenceId: 1
        },
        body: {
            yearsOfExperience: 2
        }
    } as unknown as Request
    await patchUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
  })
})



describe('Test all with bad parameters on competenceRouter', () => {
    let mockResponse: Response
  
    beforeAll(() => {
      jest
        .spyOn(console, 'error')
        .mockImplementation(/*(...params) => console.log('CONSOLE_ERROR: ', ...params)*/)
    })
  
    beforeEach(() => {
      mockResponse = {
        status: jest.fn(() => ({
          json: jest.fn((...params) => console.log('STATUS_JSON', ...params)),
          send: jest.fn((...params) => console.log('STATUS_SEND', ...params)),
        })),
        sendStatus: jest.fn(() => null),
        json: jest.fn(() => null),
      } as unknown as Response
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
  
    test('Should call 400 on getCompetenceProfile', async () => {
      const mockRequest = {
          params: {
              personId: -1
          },
      } as unknown as Request
      await getCompetenceProfile(mockRequest, mockResponse, (() => null) as NextFunction)
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(400)
    })
  
    test('Should call 400 on createUserCompetence', async () => {
      const mockRequests = [
      {
        body: {
            competence: {
                competenceId: "nan", // bad
                name: "test"
            },
            yearsOfExperience: 2,
        },
        params: {
            personId: 1
        }
      }, 
      {
        body: {
            competence: {
                competenceId: 1,
                name: 1 // bad
            },
            yearsOfExperience: 2
        },
        params: {
            personId: 1
        }
      },
      {
        body: {
            competence: {
                competenceId: 1,
                name: "test"
            },
            yearsOfExperience: "nan" // bad
        },
        params: {
            personId: 1
        }
      },
      {
        body: {
            competence: {
                competenceId: 1,
                name: "test"
            },
            yearsOfExperience: 2 
        },
        params: {
            personId: "nan" // bad
        }
      }
    ] as unknown as Request[]
    let calledTimes = 0
    for await (const req of mockRequests) {
        await createUserCompetence(req, mockResponse, (() => null) as NextFunction)
        calledTimes++
        expect(mockResponse.sendStatus).toHaveBeenLastCalledWith(400)
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(calledTimes)
    }
    })

    test('Should call 400 on deleteUserCompetence', async () => {
      const mockRequest = [{
        params: {
            personId: "nan",
            competenceId: 1
        }
      },
      {
        params: {
          personId: 1,
          competenceId: "nan"
        }
      }] as unknown as Request
      let calledTimes = 0
      for await (const req of mockRequest) {
        await deleteUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
        calledTimes++
        expect(mockResponse.status).toHaveBeenLastCalledWith(400)
        expect(mockResponse.status).toHaveBeenCalledTimes(calledTimes)
      }
    })


    test('Should call 400 on patchUserCompetence', async () => {
      const mockRequest = [{
        params: {
            personId: "nan", // bad
            competenceId: 1
        },
        body: {
          yearsOfExperience: 2
        }
      },
      {
        params: {
          personId: 1,
          competenceId: "nan" // bad
        },
        body: {
          yearsOfExperience: 2
        }
      },
      {
        params: {
          personId: 1,
          competenceId: 1
        },
        body: {
          yearsOfExperience: "nan" // bad
        }
      }] as unknown as Request
      let calledTimes = 0
      for await (const req of mockRequest) {
        await patchUserCompetence(mockRequest, mockResponse, (() => null) as NextFunction)
        calledTimes++
        expect(mockResponse.status).toHaveBeenLastCalledWith(400)
        expect(mockResponse.status).toHaveBeenCalledTimes(calledTimes)
      }
    })

})

