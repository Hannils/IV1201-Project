import request from 'supertest'
import { initServer } from '../src/App'

const app = initServer()

describe('Test basic endpoint', () => {
  test('GET /', async () => {
    const res = await request(app).get('/')
    expect(res.status).toEqual(200)
  })
  test('Test random route is 404', async () => {
    const res = await request(app).get('/' + Math.random())
    expect(res.status).toEqual(404)
  })
  test('POST /', async () => {
    const res = await request(app).post('/')
    expect(res.status).not.toEqual(200)
  })
  test('PUT /', async () => {
    const res = await request(app).put('/')
    expect(res.status).toEqual(404)
  })
  test('DELETE /', async () => {
    const res = await request(app).delete('/')
    expect(res.status).toEqual(404)
  })
})
