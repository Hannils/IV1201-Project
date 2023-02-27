import { NextFunction, Request, Response } from 'express'
import isAuthorized from '../../src/util/isAuthorized'
import { Role } from '../../src/util/Types'
import createMockResponse from '../routers/createMockResponse'

describe('Is authorized test', () => {
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

  test('Test with accept all roles', () => {
    const nextfn = jest.fn(() => null) as NextFunction
    mockResponse.locals.currentUser.role = 'ANY_ROLE'
    isAuthorized()({} as Request, mockResponse, nextfn)

    expect(nextfn).toHaveBeenCalled()
  })

  test('Test with accept a specific roles', () => {
    const nextfn = jest.fn(() => null) as NextFunction
    mockResponse.locals.currentUser.role = 'applicant' satisfies Role
    isAuthorized(['applicant'] satisfies Role[])({} as Request, mockResponse, nextfn)

    expect(nextfn).toHaveBeenCalled()
  })

  test('Test with wrong role', () => {
    const nextfn = jest.fn(() => null) as NextFunction
    mockResponse.locals.currentUser.role = 'recruiter' satisfies Role
    isAuthorized(['applicant'] satisfies Role[])({} as Request, mockResponse, nextfn)

    expect(nextfn).not.toHaveBeenCalled()
  })

  test('Test with unauthorized', () => {
    const nextfn = jest.fn(() => null) as NextFunction
    mockResponse.locals.currentUser = null
    isAuthorized()({} as Request, mockResponse, nextfn)

    expect(nextfn).not.toHaveBeenCalled()
  })
})
