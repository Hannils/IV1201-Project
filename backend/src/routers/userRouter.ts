import express from 'express'
import asyncHandler from 'express-async-handler'
import crypto from 'crypto'
import { z } from 'zod'
import {
  insertPerson,
  selectPersonByEmail,
  selectPersonById,
  selectPersonByUsername,
} from '../integrations/DAO/userDAO'
import isAuthorized from '../util/isAuthorized'
import { Person } from '../util/Types'
import * as schemas from '../util/schemas'
import tokenManager from '../util/tokenManager'

const createUserParams = z.object({
  username: schemas.usernameSchema,
  firstname: schemas.firstnameSchema,
  lastname: schemas.lastnameSchema,
  email: schemas.emailSchema,
  personNumber: schemas.personNumberSchema,
  password: schemas.passwordSchema,
})

/**
 * This method create a new user and get a feedback
 * @param req
 * @param res
 * @returns
 */
const createUser: express.RequestHandler = async (req, res) => {
  let user: z.infer<typeof createUserParams>

  try {
    user = createUserParams.parse(req.body)
  } catch (err: unknown) {
    return err instanceof z.ZodError
      ? res.status(400).json(err.issues)
      : res.sendStatus(500) // Should never happen
  }

  const salt = crypto.randomBytes(16).toString('hex')
  let password: string
  try {
    password = await new Promise<string>((resolve, reject) => {
      crypto.pbkdf2(user.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) reject(err)
        return resolve(hashedPassword.toString('hex'))
      })
    })
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }

  const person = {
    ...user,
    password: password,
    role: 'applicant',
    salt: salt,
  } satisfies Omit<Person, 'personId'>

  let personId: number

  try {
    personId = await insertPerson(person)
  } catch (error: any) {
    console.error(error.message)
    return res.status(500).send('Database Error')
  }

  let token: string

  try {
    token = await tokenManager.createToken(personId)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }

  res.json({
    token,
    user: {
      email: user.email,
      personNumber: user.personNumber,
      username: user.username,
      personId,
      firstname: user.firstname,
      lastname: user.lastname,
      role: person.role,
    },
  })
}

const signInParams = z.object({
  username: schemas.usernameSchema,
  password: schemas.passwordSchema,
})

/**
 * This method Signs in an existing user
 * @param req - Request containing  `username: string` & `password: string`
 * @param res - Either `200` or `404`
 * @returns
 */
const signInUser: express.RequestHandler = async (req, res) => {
  try {
    const params = signInParams.parse(req.body)
    const user = await selectPersonByUsername(params.username)
    if (user === null || user === undefined) {
      return res.status(404).send('USER_NOT_FOUND')
    }

    const password = await new Promise<string>((resolve, reject) =>
      crypto.pbkdf2(
        params.password,
        user.salt,
        310000,
        32,
        'sha256',
        (err, hashedPassword) => {
          if (err) reject(err)
          return resolve(hashedPassword.toString('hex'))
        },
      ),
    )

    if (password !== user.password) return res.status(400).send('WRONG_PASSWORD')

    let token: string

    try {
      token = await tokenManager.createToken(user.personId)
    } catch (error: any) {
      console.error(error.message)
      return res.sendStatus(500)
    }

    res.json({
      token,
      user: {
        email: user.email,
        personNumber: user.personNumber,
        username: user.username,
        personId: user.personId,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    })
  } catch (e: any) {
    console.error(e.message)
    res.sendStatus(400)
  }
}

const getUser: express.RequestHandler = async (req, res) => {
  const { personId } = res.locals.currentUser
  const person = await selectPersonById(personId)
  return res.json(person)
}

const userRouter = express.Router()
userRouter.get('/', isAuthorized(), asyncHandler(getUser))
userRouter.post('/', asyncHandler(createUser))
userRouter.post('/signin', asyncHandler(signInUser))

export default userRouter
