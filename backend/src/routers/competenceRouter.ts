import express from 'express'
import asyncHandler from 'express-async-handler'
import z from 'zod'

import {
  dropUserCompetence,
  insertUserCompetence,
  selectCompetence,
  selectCompetenceProfile,
  updateUserCompetence,
} from '../integrations/DAO/competenceDAO'
import isAuthorized from '../util/isAuthorized'
import { Competence, UserCompetence, UserCompetenceSchema } from '../util/Types'

const updateParams = z.object({
  personId: z.string(),
  applicationStatus: z.string(),
})

/**
 * This method retrieves all competences
 * @param req - Request
 * @param res -
 * - `200`: Sends Competences as Competence[]
 * - `500`: Database or internal error
 * @returns `void`
 * @authorization none
 */
export const getCompetences: express.RequestHandler = async (req, res) => {
  try {
    const response = await selectCompetence()
    res.json(response)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}
/**
 * This method retrieves competenceProfile for specific person
 * @param req - Request containing `personId` as number
 * @param res -
 * - `200`: sends `competenceProfile` as {@link UserCompetenceSchema}
 * - `500`: Database or internal error
 * @returns `void`
 * @authorization `[Applicant | Recruiter]`
 */
export const getCompetenceProfile: express.RequestHandler = async (req, res) => {
  try {
    const competenceProfile = await selectCompetenceProfile(
      Number(req.params.personId),
    )
    if (competenceProfile === null || competenceProfile === undefined) res.sendStatus(400)
    res.json(competenceProfile)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}

/**
 * This method creates a userCompetence for specific person
 * @param req - Request containing body
 * @param res -
 * - `200`: Success
 * - `400`: Body does not match validation schema. body will contain {@link ZodIssue}[] with the provided data
 * - `500`: Database or internal error
 * @body
 * - `competence`
 * - `yearsOfExperience`
 * @returns `void`
 * @authorization `Applicant`
 */
export const createUserCompetence: express.RequestHandler = async (req, res) => {
  let competence: UserCompetence, personId: number

  try {
    competence = UserCompetenceSchema.parse(req.body)
    personId = z.number().parse(Number(req.params.personId))
  } catch (error) {
    console.error("This is error: ", error)
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
 * This method deletes competenceProfile for specific person
 * @param req - Request containing `personId` as number & `competenceId` as number
 * @param res -
 * - `200`: OK
 * - `400`: Body does not match validation schema. body will contain {@link ZodIssue}[] with the provided data
 * - `500`: Database or internal error
 * @returns `void`
 * @authorization `Applicant`
 */
export const deleteUserCompetence: express.RequestHandler = async (req, res) => {
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
 * This method patches competenceProfile for specific person
 * @param req - Request containing body
 * @param res -
 * - `200`: Successful update.
 * - `400`: Body does not match validation schema. body will contain {@link ZodIssue}[] with the provided data
 * - `500`: Database or internal error
 * @body
 * - `yearsOfExperience`: number
 * - `competenceId`: number
 * - `personId`: number
 *
 * @returnBody
 * **200**
 * - jasd
 * - asd
 *
 * **500**
 *  - asd
 * - asd
 * @returns `void`
 * @authorization `Applicant`
 */
export const patchUserCompetence: express.RequestHandler = async (req, res) => {
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
