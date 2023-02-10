import { z } from 'zod'
export type Role = 'recruiter' | 'applicant'
export type ApplicationStatus = 'unhandled' | 'rejected' | 'approved'

export const CompetenceSchema = z.object({
  competenceId: z.number(),
  name: z.string(),
})

export type Competence = z.infer<typeof CompetenceSchema>

export const UserCompetenceSchema = z.object({
  competence: CompetenceSchema,
  yearsOfExperience: z.number(),
})

export type UserCompetence = z.infer<typeof UserCompetenceSchema>

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

export type CompetenceProfile = Array<UserCompetence>

export type Person = z.infer<typeof PersonSchema>

export const IncompletePersonSchema = z.object({
  personId: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  role: z.string(),
  email: z.string().email(),
  personNumber: z.string(),
})

export type IncompletePerson = z.infer<typeof IncompletePersonSchema>

export interface Application {
  competenceProfile: Array<Competence>
  availability: Array<AvailabilityPeriod>
  status: ApplicationStatus
}

export interface UserApplication extends Application {
  user: Person
}

export interface AvailabilityPeriod {
  startDate: Date
  endDate: Date
}
