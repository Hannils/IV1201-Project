import { z } from 'zod'

export type Role = 'recruiter' | 'applicant'
export type ApplicationStatus = 'unhandled' | 'rejected' | 'approved'

export interface Person {
  personId: number
  username: string
  firstname: string
  lastname: string
  personNumber: string
  email: string
  role: Role
}

export interface Application {
  competenceProfile: CompetenceProfile
  availability: Array<AvailabilityPeriod>
  status: ApplicationStatus
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
