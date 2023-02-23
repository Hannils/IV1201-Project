import { z } from 'zod'
import { passwordSchema, usernameSchema } from '../../util/schemas'

export const getTokenSchema = z.object({
  email: z.string().email(),
})

export type GetTokenFields = z.infer<typeof getTokenSchema>

export const validateTokenSchema = z.object({
  token: z.string().uuid("Invalid token"),
})

export type ValidateTokenFields = z.infer<typeof validateTokenSchema>

export const updateSchema = z.object({
  token: z.string().uuid(),
  username: usernameSchema,
  password: passwordSchema,
})

export type UpdateFields = z.infer<typeof updateSchema>
