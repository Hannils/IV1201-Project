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
    message: 'PersonNumber must be format YYYYMMDD-XXXX',
  })

export const passwordSchema = z
  .string()
  .refine((val) => val.length <= 255, {
    message: "Password can't be more than 255 characters",
  })
  .refine((val) => val.length > 5, {
    message: 'Password should be longer than 5 characters',
  })

export const yearsOfExperienceSchema = z.number().min(0).max(100)

export const ApplicationStatusStateSchema = z.enum(['unhandled', 'rejected', 'accepted'])

export const ApplicationStatusSchema = z.object({
  statusId: z.number(),
  name: ApplicationStatusStateSchema,
})

export const AvailabilitySchema = z.object({
  availabilityId: z.number(),
  personId: z.number(),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
})

export const OpportunitySchema = z.object({
  opportunityId: z.number(),
  applicationPeriodStart: z.coerce.date(),
  applicationPeriodEnd: z.coerce.date(),
  name: z.string(),
  description: z.string(),
})

export const ApplicationSchema = z.object({
  applicationId: z.number(),
  personId: z.number(),
  status: ApplicationStatusSchema,
  opportunity: OpportunitySchema.omit({ description: true }),
})

export const CompetenceSchema = z.object({
  competenceId: z.number(),
  name: z.string(),
})

export const UserCompetenceSchema = z.object({
  competence: CompetenceSchema,
  yearsOfExperience: z.number(),
})

export const PersonSchema = z.object({
  personId: z.number(),
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  role: z.enum(['recruiter', 'applicant']),
  email: z.string().email().nullable(),
  personNumber: z.string().nullable(),
  password: z.string(),
  salt: z.string(),
})

export const IncompletePersonSchema = z.object({
  personId: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  role: z.string(),
  email: z.string().email(),
  personNumber: z.string(),
})

export const ApplicationPreviewSchema = ApplicationSchema.omit({
  opportunity: true,
  personId: true,
}).extend({
  competences: z.array(UserCompetenceSchema),
  person: PersonSchema.pick({
    personId: true,
    firstname: true,
    lastname: true,
  }),
})
