import { z } from 'zod'

export type Role = 'recruiter' | 'applicant'

export const ApplicationStatusSchema = z.enum(['unhandled', 'rejected', 'approved'])

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>

export interface Person {
  personId: number
  username: string
  firstname: string
  lastname: string
  personNumber: string
  email: string
  role: Role
}

export interface UserApplication extends Application {
  user: Person
}

export interface Competence {
  name: string
  competenceId: number
}

export interface UserCompetence {
  competence: Competence
  yearsOfExperience: number
}

export type CompetenceProfile = Array<UserCompetence>

export interface AvailabilityPeriod {
  startDate: Date
  endDate: Date
}

export const OpportunitySchema = z.object({
  opportunityId: z.number(),
  applicationPeriodStart: z.coerce.date(),
  applicationPeriodEnd: z.coerce.date(),
  name: z.string(),
  description: z.string(),
})

export type Opportunity = z.infer<typeof OpportunitySchema>

export const ApplicationSchema = z.object({
  applicationId: z.number(),
  personId: z.number(),
  status: ApplicationStatusSchema,
  opportunity: OpportunitySchema.omit({ description: true }),
})

export type Application = z.infer<typeof ApplicationSchema>

export const AvailabilitySchema = z.object({
  availabilityId: z.number(),
  personId: z.number(),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
})

export type Availability = z.infer<typeof AvailabilitySchema>
