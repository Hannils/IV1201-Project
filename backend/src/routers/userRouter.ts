import crypto from 'crypto'
import express from 'express'
import asyncHandler from 'express-async-handler'
import { z, ZodIssue } from 'zod'

import {
  insertPerson,
  selectPersonByEmail,
  selectPersonById,
  selectPersonByUsername,
} from '../integrations/DAO/userDAO'
import isAuthorized from '../util/isAuthorized'
import * as schemas from '../util/schemas'
import tokenManager from '../util/tokenManager'
import { Person } from '../util/Types'

const createUserParams = z.object({
  username: schemas.usernameSchema,
  firstname: schemas.firstnameSchema,
  lastname: schemas.lastnameSchema,
  email: schemas.emailSchema,
  personNumber: schemas.personNumberSchema,
  password: schemas.passwordSchema,
})
/**
 * This method creates a new user and sends response
 * @param req - Request containing body
 * @param res -
 * - `200`: Sends `token` as `string` & `user` as {@link Person} in body
 * - `400`: Body does not match validation schema. body will contain {@link ZodIssue}[] with the provided data
 * - `500`: Database or internal error
 * @body
 * - `username`: {@link schemas.usernameSchema},
 * - `firstname`: {@link schemas.firstnameSchema},
 * - `lastname`: {@link schemas.lastnameSchema},
 * - `email`: {@link schemas.emailSchema},
 * - `personNumber`: {@link schemas.personNumberSchema},
 * - `password`: {@link schemas.passwordSchema},
 * @returns `void`
 * @authorization none
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
 * @param req - Request containing body
 * @param res -
 * - `200`: Sends `token` as `string` & `user` as {@link Person} in body
 * - `400`: Body does not match validation schema. body will contain an array of issues with the provided data
 * - `500`: Database or internal error
 * @body
 * - `username`: {@link schemas.usernameSchema},
 * - `password`: {@link schemas.passwordSchema},
 * @returns `void`
 * @authorization none
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
/**
 * This method gets the current user
 * @param req - Request containing body
 * @param res -
 * - `200`: Sends `user` as {@link Person} in body
 * - `404`: User not found
 * - `500`: Database or internal error
 * @returns `void`
 * @authorization `[Applicant | Recruiter]`
 */
const getUser: express.RequestHandler = async (req, res) => {
  const { personId } = res.locals.currentUser
  try {
    const person = await selectPersonById(personId)
    if (person === null) return res.sendStatus(404)
    res.json(person)
  } catch (e: any) {
    console.error(e.message)
    res.sendStatus(400)
  }
}

const userRouter = express.Router()

userRouter.get('/', isAuthorized(), asyncHandler(getUser))
userRouter.post('/', asyncHandler(createUser))
userRouter.post('/signin', asyncHandler(signInUser))

export default userRouter
