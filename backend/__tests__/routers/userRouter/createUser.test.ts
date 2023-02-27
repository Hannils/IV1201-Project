import { NextFunction } from "express";
import { createUser } from "../../../src/routers/userRouter/createUser";

describe('Test create user', () => {
    let mockResponse: Response
    beforeAll(() => {
        jest
          .spyOn(console, 'error')
          .mockImplementation((...params) => console.log('CONSOLE_ERROR: ', ...params))
      })
    
      beforeEach(() => {
        mockResponse = {
          status: jest.fn(() => ({
            json: jest.fn(/* (...params) => console.log('STATUS_JSON', ...params) */),
            send: jest.fn(/* (...params) => console.log('STATUS_SEND', ...params) */),
          })),
          sendStatus: jest.fn(() => null),
          json: jest.fn(() => null),
        } as unknown as Response
      })
      afterEach(() => {
        jest.clearAllMocks()
      })

    test('Should be able to create a user', async () => {
        const mockRequest = {
            body: {
                username: 'username',
                firstname: 'firstname',
                lastname: 'lastname',
                email: 'test@test.se',
                personNumber: '20000101-0000',
                password: 'password',
            },
        } as unknown as Request
          await createUser(mockRequest, mockResponse, (() => null) as NextFunction)
          expect(mockResponse.json).toHaveBeenCalled()
    })
});