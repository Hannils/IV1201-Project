import express from 'express'
import asyncHandler from 'express-async-handler'
import { TokenManager } from '../../util/tokenManager'
import { generateToken } from './generateToken'
import { migrateUser } from './migrateUser'
import { validateToken } from './validateToken'

export const migrationTokenStore = new TokenManager(1000 * 60 * 10, crypto.randomUUID)

const userMigrationRouter = express.Router()
userMigrationRouter.get('/token/:token', asyncHandler(validateToken))
userMigrationRouter.post('/token', asyncHandler(generateToken))
userMigrationRouter.put('/', asyncHandler(migrateUser))
export default userMigrationRouter