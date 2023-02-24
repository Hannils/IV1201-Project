import express from 'express'
import asyncHandler from 'express-async-handler'

import isAuthorized from '../../util/isAuthorized'
import { createUserCompetence } from './createUserCompetence'
import { deleteUserCompetence } from './deleteUserCompetence'
import { getCompetenceProfile } from './getCompetenceProfile'
import { getCompetences } from './getCompetences'
import { patchUserCompetence } from './patchUserCompetence'

const competenceRouter = express.Router()
competenceRouter.get('/', asyncHandler(getCompetences))
competenceRouter.get('/:personId', isAuthorized(), asyncHandler(getCompetenceProfile))
competenceRouter.post('/', isAuthorized(), asyncHandler(createUserCompetence))
competenceRouter.delete(
  '/:competenceId',
  isAuthorized(),
  asyncHandler(deleteUserCompetence),
)
competenceRouter.patch(
  '/:competenceId',
  isAuthorized(),
  asyncHandler(patchUserCompetence),
)

export default competenceRouter
