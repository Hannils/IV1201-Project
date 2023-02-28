import { Request, Response, NextFunction } from 'express'
import { Person } from '../../../src/util/Types'
import crypto from 'crypto'

jest.mock('../../../src/integrations/DAO/DAO', () => ({
  doTransaction: async (cb: () => Promise<unknown>) => await cb(),
}))

jest.mock('../../../src/integrations/DAO/userDAO', () => ({
  selectIncompletePersonByEmail: jest.fn(async (email: string) => {
    if (email === 'complete-user@example.com') return null
    const hashedPassword = await new Promise<string>((resolve, reject) =>
      crypto.pbkdf2(
        'password',
        'randomSalt',
        310000,
        32,
        'sha256',
        (err, hashedPassword) => {
          if (err) reject(err)
          return resolve(hashedPassword.toString('hex'))
        },
      ),
    )
    return {
      username: 'username',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'test@test.se',
      role: 'applicant',
      personId: -1,
      personNumber: '20000101-0000',
      password: hashedPassword,
      salt: 'randomSalt',
    } satisfies Person
  }),
  migratePerson: jest.fn(
    async ({
      username,
      password,
      salt,
      personId,
    }: {
      username: string
      password: string
      salt: string
      personId: number
    }) => null,
  ),
  selectPersonByUsername: jest.fn(async (username: string) => {
    if (username === 'NON_EXISTING_PERSON') return null
    const hashedPassword = await new Promise<string>((resolve, reject) =>
      crypto.pbkdf2(
        'password',
        'randomSalt',
        310000,
        32,
        'sha256',
        (err, hashedPassword) => {
          if (err) reject(err)
          return resolve(hashedPassword.toString('hex'))
        },
      ),
    )
    return {
      username: 'username',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'test@test.se',
      role: 'applicant',
      personId: 1,
      personNumber: '20000101-0000',
      password: hashedPassword,
      salt: 'randomSalt',
    } satisfies Person
  }),
  selectPersonById: jest.fn(async (personId) => {
    if (personId === -1) return null
    return {} as Person
  }),
}))
