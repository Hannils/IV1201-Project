import request from 'supertest'
import { init, initServer } from '../src/App'
import * as DAO from '../src/integrations/DAO/DAO'

jest.mock('../src/integrations/DAO/DAO', () => ({
  initDatabase: jest.fn(async () => null),
}))

describe('Test basic endpoint', () => {
  test('Init function', async () => {
    const initDatabaseSpy = jest.spyOn(DAO, 'initDatabase')
    await init()

    expect(initDatabaseSpy).toHaveBeenCalled()
  })
})
