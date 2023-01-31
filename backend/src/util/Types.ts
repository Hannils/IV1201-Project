import { z } from 'zod'
export type Role = 'recruiter' | 'applicant'
export type ApplicationStatus = 'unhandled' | 'rejected' | 'approved'

export const PersonSchema = z.object({
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  role: z.enum(['recruiter', 'applicant']),
  email: z.string().email().optional(),
  personNumber: z.string().optional(),
  password: z.string(),
  salt: z.string(),
})

export type Person = z.infer<typeof PersonSchema>

export const IncompletePersonSchema = z.object({
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

export interface Competence {
  competence: string
  yearsOfExperience: number
}

export interface AvailabilityPeriod {
  startDate: Date
  endDate: Date
}
