import { z } from 'zod'
import { passwordSchema, usernameSchema } from '../../util/schemas'

export const SignInSchema = z.object({
    username: usernameSchema,
    password: passwordSchema,
  })
  
  export type SignInFields = z.infer<typeof SignInSchema>