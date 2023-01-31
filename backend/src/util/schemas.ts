import { z } from 'zod'

export const usernameSchema = z
  .string()
  .refine((val) => val.length <= 255, {
    message: "Username can't be more than 255 characters",
  })
  .refine((val) => val.length >= 3, {
    message: 'Username Must be atleast 3 characters',
  })

export const firstnameSchema = z.string().refine((val) => val.length <= 255, {
  message: "Firstname can't be more than 255 characters",
})

export const lastnameSchema = z.string().refine((val) => val.length <= 255, {
  message: "Lastname can't be more than 255 characters",
})

export const emailSchema = z
  .string()
  .email()
  .refine((val) => val.length <= 255, {
    message: "Email can't be more than 255 characters",
  })

export const personNumberSchema = z
  .string()
  .refine((val) => val.match(/^\d{8}-\d{4}$/) !== null, {
    message: 'Password must be format YYYYMMDD-XXXX',
  })
export const passwordSchema = z
  .string()
  .refine((val) => val.length <= 255, {
    message: "Password can't be more than 255 characters",
  })
  .refine((val) => val.length > 5, {
    message: 'Password should be longer than 5 characters',
  })
