import express from 'express'
import { ZodError } from 'zod'

import { selectApplicationPreview } from '../../integrations/DAO/applicationDAO'

export const getApplicationPreview: express.RequestHandler = async (req, res) => {
  const opportunityId = Number(req.params.opportunityId)

  if (isNaN(opportunityId)) return res.sendStatus(400)
  try {
    const applicationPreviews = await selectApplicationPreview(opportunityId)
    res.json(applicationPreviews)
  } catch (error: any) {
    console.error(error.message)
    return error instanceof ZodError
      ? res.status(400).json(error.message)
      : res.sendStatus(500)
  }
}
