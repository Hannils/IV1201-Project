import { z } from 'zod'

import {
  emailSchema,
  firstnameSchema,
  lastnameSchema,
  passwordSchema,
  personNumberSchema,
  usernameSchema,
} from '../../util/schemas'

export const SignupSchema = z.object({
  firstname: firstnameSchema,
  lastname: lastnameSchema,
  email: emailSchema,
  personNumber: personNumberSchema,
  username: usernameSchema,
  password: passwordSchema,
})

export type SignupFields = z.infer<typeof SignupSchema>
