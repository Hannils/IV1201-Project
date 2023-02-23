import express from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import * as schemas from '../../util/schemas'
import { insertPerson, selectPersonByUsername } from '../../integrations/DAO/userDAO'
import tokenManager from '../../util/tokenManager'
import { Person } from '../../util/Types'
import { doTransaction } from '../../integrations/DAO/DAO'
import { usernameSchema, firstnameSchema, lastnameSchema, emailSchema, personNumberSchema, passwordSchema } from '../../util/schemas'

const createUserParams = z.object({
  username: schemas.usernameSchema,
  firstname: schemas.firstnameSchema,
  lastname: schemas.lastnameSchema,
  email: schemas.emailSchema,
  personNumber: schemas.personNumberSchema,
  password: schemas.passwordSchema,
})

/**
 * This method creates a new user
 * @param req Contains the request data
 * @param res Contains the response data 
 * @description **The request contains the following:**
 * - `body`:
  * - - `username`: Username of the user as {@link usernameSchema}.
  * - - `firstname`: Firstname of the user as {@link firstnameSchema}.
  * - - `lastname`: Lastname of the user as {@link lastnameSchema}.
  * - - `email`: Email of the user as {@link emailSchema}.
  * - - `personNumber`: Person number of the user as {@link personNumberSchema}.
  * - - `password`: Password of the user as {@link passwordSchema}.
  * 
 * - `params`:
 * - - `none`.
 
 * **The response contains the following:**
 * - `Status: 200`: Token as `string` and user as {@link Person}.
 * - `Status: 400`: User already exists.
 * - `Status: 500`: Internal Server Error.
 * @returns `void`
 * @authorization `none`
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
    const result = await doTransaction<number | false>(async () => {
      const alreadyExistingPerson = await selectPersonByUsername(person.username)

      if (alreadyExistingPerson !== null)
        return  false

      return personId = await insertPerson(person)
    })

    if(!result) return res.status(400).send('USER_ALREADY_EXISTS')
    personId = result
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
