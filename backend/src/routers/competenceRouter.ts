import express from 'express'
import asyncHandler from 'express-async-handler'
import isAuthorized from '../util/isAuthorized'
import z from 'zod'
import { selectCompetence, selectCompetenceProfile } from '../integrations/DAO/competenceDAO'

const updateParams = z.object({
  personId: z.string(),
  applicationStatus: z.string(),
})

const getCompetences: express.RequestHandler = async (req, res) => {
  try {
    const response = await selectCompetence()
    res.json(response)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}

const getCompetenceProfile: express.RequestHandler = async (req, res) => {
  try {
    const competenceProfile = await selectCompetenceProfile(req.params.personId);

    res.json(competenceProfile)
  } catch (error: any) {
    console.error(error.message)
    return res.sendStatus(500)
  }
}

const createCompetenceProfile: express.RequestHandler = async (req, res) => {

}

const updateCompetenceProfile: express.RequestHandler = async (req, res) => {

}

const deleteCompetenceProfile: express.RequestHandler = async (req, res) => {

}

const competenceRouter = express.Router()

competenceRouter.get('/', asyncHandler(getCompetences))
competenceRouter.get('/:personId', asyncHandler(getCompetenceProfile))

export default competenceRouter
