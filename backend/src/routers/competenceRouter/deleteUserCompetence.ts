import express from 'express'
import { z } from 'zod'
import { dropUserCompetence } from '../../integrations/DAO/competenceDAO'

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
    const competenceId = Number(req.params.competenceId)
    if (isNaN(competenceId)) return res.sendStatus(400)
    try {
      await dropUserCompetence({
        competenceId,
        personId: res.locals.currentUser.personId,
      })
    } catch (error: any) {
      console.error(error)
      return error instanceof z.ZodError
        ? res.status(400).json(error.issues)
        : res.sendStatus(500)
    }
  
    res.sendStatus(200)
  }