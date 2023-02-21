import express from "express"
import isAuthorized from '../../util/isAuthorized'
import asyncHandler from 'express-async-handler'
import { createUser } from "./createUser"
import { getUser } from "./getUser"
import { signInUser } from "./signInUser"
import { signOutUser } from "./signOutUser"
import { getUserWithPersonId } from "./getUserWithPersonId"

const userRouter = express.Router()
userRouter.get('/', isAuthorized(), asyncHandler(getUser))
userRouter.get('/:personId', isAuthorized(['recruiter']), asyncHandler(getUserWithPersonId))
userRouter.post('/', asyncHandler(createUser))
userRouter.post('/signin', asyncHandler(signInUser))
userRouter.post('/signout', isAuthorized(), asyncHandler(signOutUser))
export default userRouter