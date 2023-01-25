import express from 'express'
import asyncHandler from 'express-async-handler'
import admin from 'firebase-admin'
import { UserRecord } from 'firebase-admin/auth'

import { z } from 'zod'
import isAuthorized from '../util/isAuthorized'

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
    const {
      email,
      password,
      username: displayName,
      ...newUser
    } = createUserParams.parse(req.body)

    const requesterIsRecruter = res.locals.currentUser?.role === 'recruiter'

    const createdUser = await admin.auth().createUser({ email, password, displayName })
    const token = await admin.auth().createCustomToken(createdUser.uid)

    await admin
      .auth()
      .setCustomUserClaims(createdUser.uid, {
        role: requesterIsRecruter ? 'recruiter' : 'applicant',
      })

    res.status(200).json({ signInToken: token })
  } catch (e: any) {
    console.error(e.message)
    return res.sendStatus(400)
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
    const response = await admin.auth().updateUser(res.locals.currentUser, {
      displayName: username,
    })
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
  }
}
/** */
const deleteUser: express.RequestHandler = async (req, res) => {
  await admin.auth().deleteUser(res.locals.currentUser)
  res.sendStatus(200)
}

const userRouter = express.Router()
/* userRouter.get('/', asyncHandler(getUser)) */
userRouter.post('/', asyncHandler(createUser))
userRouter.patch('/', isAuthorized(), asyncHandler(patchUser))
userRouter.delete('/', isAuthorized(), asyncHandler(deleteUser))

export default userRouter
