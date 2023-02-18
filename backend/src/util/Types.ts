import { z } from 'zod'
import { dateInputFormatter } from './IntlFormatters'
export type Role = 'recruiter' | 'applicant'
export type ApplicationStatus = 'unhandled' | 'rejected' | 'approved'

export const AvailabilityBaseSchema = z
.object({
  availabilityId: z.number(),
  personId: z.number(),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
})

export const AvailabilitySchema = z
  .object({
    availabilityId: z.number(),
    personId: z.number(),
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
  })
  .transform(({ fromDate, toDate, ...rest }) => ({
    ...rest,
    fromDate: dateInputFormatter.format(fromDate),
    toDate: dateInputFormatter.format(toDate),
  }))

export type Availability = z.infer<typeof AvailabilitySchema>

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
  statusId: z.number(),
  opportunityId: z.number(),
})

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
