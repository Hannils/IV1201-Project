import express from 'express'
import { z } from 'zod'
import { migrationTokenStore } from '.'
import tokenManager from '../../util/tokenManager'
import * as schemas from '../../util/schemas'
import crypto from 'crypto'
import { migratePerson, selectPersonById } from '../../integrations/DAO/userDAO'

const migrateUserParams = z.object({
    token: z.string().uuid(),
    username: schemas.usernameSchema,
    password: schemas.passwordSchema,
  })

export const migrateUser: express.RequestHandler = async (req, res) => {
    let data: z.infer<typeof migrateUserParams>
  
    try {
      data = migrateUserParams.parse(req.body)
    } catch (err: unknown) {
      return err instanceof z.ZodError
        ? res.status(400).json(err.issues)
        : res.sendStatus(500) // Should never happen
    }
  
    const personId = migrationTokenStore.validateToken(data.token)
  
    if (personId === null) return res.sendStatus(404)
  
    const salt = crypto.randomBytes(16).toString('hex')
    let password: string
    try {
      password = await new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(data.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
          if (err) reject(err)
          return resolve(hashedPassword.toString('hex'))
        })
      })
    } catch (error: any) {
      console.error(error.message)
      return res.sendStatus(500)
    }
  
    try {
      await migratePerson({
        ...data,
        password,
        salt,
        personId,
      })
  
      const user = await selectPersonById(personId)
  
      migrationTokenStore.deleteToken(data.token)
  
      const token = await tokenManager.createToken(personId)
      res.json({ token, user })
    } catch (error: any) {
      console.error(error.message)
      res.sendStatus(500)
    }
  }