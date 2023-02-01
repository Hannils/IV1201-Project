import request from 'supertest'
import { initServer } from '../../src/App'

const app = initServer()

describe('Test userRouter.ts', () => {
  beforeAll(() => {
    jest.mock('../../src/integrations/DAO/userDAO', () => {
      //Mock the default export and named export 'foo'
      return {
        __esModule: true,
        insertPerson: jest.fn(() => {
          throw new Error('Error')
        }),
        selectPersonByEmail: jest.fn(() => null),
        selectPersonById: jest.fn(() => null),
        selectPersonByUsername: jest.fn(() => null),
        default: jest.fn(() => 'mocked baz'),
      }
    })
  })

  afterAll(() => {
    jest.unmock('../../src/integrations/DAO/userDAO')
  })
  test('Create', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const res = await request(app).post('/user').send({
      username: 'username',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'test@test.se',
      personNumber: '20000101-0000',
      password: 'password',
    })

    expect(consoleSpy).toHaveBeenCalled()
    expect(res.statusCode).toBe(500)
  })
})
