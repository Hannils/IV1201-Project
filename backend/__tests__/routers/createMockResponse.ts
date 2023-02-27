import { Response } from 'express'

export default function createMockResponse() {
  const statusJson =
    jest.fn(/* (...params: any[]) => console.log('STATUS_JSON', ...params) */)
  const statusSend =
    jest.fn(/* (...params: any[]) => console.log('STATUS_SEND', ...params) */)
  return {
    locals: {
      currentUser: { personId: 1 },
    },
    status: jest.fn(() => ({
      json: statusJson,
      send: statusSend,
    })),
    sendStatus:
      jest.fn(/* (...params: any[]) => console.log('SEND_STATUS', ...params) */),
    json: jest.fn(() => null),
  } as unknown as Response
}
