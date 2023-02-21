import express from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import * as schemas from '../../util/schemas'
import { insertPerson } from '../../integrations/DAO/userDAO'
import tokenManager from '../../util/tokenManager'
import { Person } from '../../util/Types'

const createUserParams = z.object({
    username: schemas.usernameSchema,
    firstname: schemas.firstnameSchema,
    lastname: schemas.lastnameSchema,
    email: schemas.emailSchema,
    personNumber: schemas.personNumberSchema,
    password: schemas.passwordSchema,
  })

/**
 * This method creates a new user and sends response
 * @param req - Request containing body
 * @param res -
 * - `200`: Sends `token` as `string` & `user` as {@link Person} in body
 * - `400`: Body does not match validation schema. body will contain {@link ZodIssue}[] with the provided data
 * - `500`: Database or internal error
 * @body
 * - `username`: {@link schemas.usernameSchema},
 * - `firstname`: {@link schemas.firstnameSchema},
 * - `lastname`: {@link schemas.lastnameSchema},
 * - `email`: {@link schemas.emailSchema},
 * - `personNumber`: {@link schemas.personNumberSchema},
 * - `password`: {@link schemas.passwordSchema},
 * @returns `void`
 * @authorization none
 */
export const createUser: express.RequestHandler = async (req, res) => {
    let user: z.infer<typeof createUserParams>
  
    try {
      user = createUserParams.parse(req.body)
    } catch (err: unknown) {
      return err instanceof z.ZodError
        ? res.status(400).json(err.issues)
        : res.sendStatus(500) // Should never happen
    }
  
    const salt = crypto.randomBytes(16).toString('hex')
    let password: string
    try {
      password = await new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(user.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
          if (err) reject(err)
          return resolve(hashedPassword.toString('hex'))
        })
      })
    } catch (error: any) {
      console.error('Hashing Error: ', error.message)
      return res.sendStatus(500)
    }
  
    const person = {
      ...user,
      password: password,
      role: 'applicant',
      salt: salt,
    } satisfies Omit<Person, 'personId'>
  
    let personId: number
  
    try {
      personId = await insertPerson(person)
    } catch (error: any) {
      res.status(500).send('Database Error')
      console.error('Database error: ', error.message)
      throw new Error(
        'Database error occurred at /user/createUser\n Error: ' + error.message,
      )
    }
  
    let token: string
  
    try {
      token = await tokenManager.createToken(personId)
    } catch (error: any) {
      console.error('Token manager error: ', error.message)
      return res.sendStatus(500)
    }
  
    res.json({
      token,
      user: {
        email: user.email,
        personNumber: user.personNumber,
        username: user.username,
        personId,
        firstname: user.firstname,
        lastname: user.lastname,
        role: person.role,
      },
    })
  }