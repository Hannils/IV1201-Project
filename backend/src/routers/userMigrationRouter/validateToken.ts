import express from 'express'
import { z } from 'zod'
import { migrationTokenStore } from '.'
import { TokenManager } from '../../util/tokenManager'


export const validateToken: express.RequestHandler = async (req, res) => {
    const token = req.params.token
  
    try {
      z.string().uuid().parse(token)
    } catch (error) {
      return res.sendStatus(400)
    }
  
    if (migrationTokenStore.validateToken(token) === null) return res.sendStatus(404)
    res.sendStatus(200)
  }