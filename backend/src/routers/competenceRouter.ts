import express from 'express'
import asyncHandler from 'express-async-handler'
import isAuthorized from '../util/isAuthorized'
import z from 'zod'
import {
  dropUserCompetence,
  insertUserCompetence,
  selectCompetence,
  selectCompetenceProfile,
  updateUserCompetence,
} from '../integrations/DAO/competenceDAO'
import { UserCompetence, UserCompetenceSchema } from '../util/Types'

const updateParams = z.object({
  personId: z.string(),
  applicationStatus: z.string(),
})

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const getCompetences: express.RequestHandler = async (req, res) => {
  try {
    const response = await selectCompetence()
    res.json(response)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}
/**
 * 
 * @param req 
 * @param res 
 * @returns
 * @requires  
 */
const getCompetenceProfile: express.RequestHandler = async (req, res) => {
  try {
    const competenceProfile = await selectCompetenceProfile(req.params.personId)

    res.json(competenceProfile)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const createUserCompetence: express.RequestHandler = async (req, res) => {
  let competence: UserCompetence, personId: number

  try {
    competence = UserCompetenceSchema.parse(req.body)
    personId = z.number().parse(Number(req.params.personId))
  } catch (error) {
    console.error(error)
    return res.sendStatus(400)
  }

  try {
    await insertUserCompetence(competence, personId)
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }

  res.sendStatus(200)
}

const manageUserParams = z.object({
  personId: z.preprocess((n) => Number(n), z.number()),
  competenceId: z.preprocess((n) => Number(n), z.number()),
})
/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const deleteUserCompetence: express.RequestHandler = async (req, res) => {
  try {
    const params = manageUserParams.parse(req.params)
    await dropUserCompetence(params)
  } catch (error: unknown) {
    console.error(error)
    return error instanceof z.ZodError
      ? res.status(400).json(error.issues)
      : res.sendStatus(500)
  }

  res.sendStatus(200)
}
/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
const patchUserCompetence: express.RequestHandler = async (req, res) => {
  try {
    const params = manageUserParams.parse(req.params)
    const yearsOfExperience = z.number().parse(req.body.yearsOfExperience)

    await updateUserCompetence({ ...params, yearsOfExperience })
  } catch (error: unknown) {
    console.error(error)
    return error instanceof z.ZodError
      ? res.status(400).json(error.issues)
      : res.sendStatus(500)
  }

  res.sendStatus(200)
}

const competenceRouter = express.Router()

competenceRouter.get('/', asyncHandler(getCompetences))
competenceRouter.get('/:personId', isAuthorized(), asyncHandler(getCompetenceProfile))
competenceRouter.post('/:personId', isAuthorized(), asyncHandler(createUserCompetence))
competenceRouter.delete(
  '/:personId/:competenceId',
  isAuthorized(),
  asyncHandler(deleteUserCompetence),
)
competenceRouter.patch(
  '/:personId/:competenceId',
  isAuthorized(),
  asyncHandler(patchUserCompetence),
)

export default competenceRouter
