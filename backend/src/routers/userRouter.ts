import express from 'express'
import asyncHandler from 'express-async-handler'
import crypto from 'crypto'
import { z } from 'zod'
import { insertPerson } from '../integrations/DAO/userDAO'
import isAuthorized from '../util/isAuthorized'
import { Person } from '../util/Types'

const createUserParams = z.object({
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  personNumber: z.string(),
  password: z.string(),
})


/* import { requireAuth } from '../util/Misc' */

/* const getUser: express.RequestHandler = async (req, res) => {
  const { uid, email, phoneNumber } = req.query
  let response: UserRecord | null
  try {
    if (typeof uid === 'string') response = await admin.auth().getUser(uid)
    else if (typeof email === 'string')
      response = await admin.auth().getUserByEmail(email)
    else if (typeof phoneNumber === 'string')
      response = await admin.auth().getUserByPhoneNumber(phoneNumber)
    else return res.status(400).json('Fields missing in GET /user')
  } catch (error) {
    // User was not found
    response = null
  }
  res.json(response)
} */

/**
 * This method create a new user and get a feedback
 * @param req
 * @param res
 * @returns
 */
const createUser: express.RequestHandler = async (req, res) => {
  try {
    const user = createUserParams.parse(req.body)
    const salt = crypto.randomBytes(16)

    const password = await new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(user.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) reject(err)
        return resolve(hashedPassword)
      })
    })

    const person = {
      ...user,
      password: password.toString(),
      role: 'applicant',
      salt: salt.toString(),
    } satisfies Person
    await insertPerson(person)

    res.sendStatus(200) /* .json(/* { signInToken: token } *) */
  } catch (e: any) {
    console.error(e.message)
    res.sendStatus(400)
  }
}
/**
 *
 * @param req
 * @param res
 * @returns
 */
const patchUser: express.RequestHandler = async (req, res) => {
  const { username, profilePicture } = req.body
  if (username === '') return res.sendStatus(400).json('Fields missing in PATCH /user')

  try {
    /* const response = await admin.auth().updateUser(res.locals.currentUser, {
      displayName: username,
    }) */
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
  }
}
/** */
const deleteUser: express.RequestHandler = async (req, res) => {
  /* await admin.auth().deleteUser(res.locals.currentUser) */
  res.sendStatus(200)
}

const userRouter = express.Router()
/* userRouter.get('/', asyncHandler(getUser)) */
userRouter.post('/', asyncHandler(createUser))
userRouter.patch('/', isAuthorized(), asyncHandler(patchUser))
userRouter.delete('/', isAuthorized(), asyncHandler(deleteUser))

export default userRouter
