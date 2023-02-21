import { z } from 'zod'

import {
  ApplicationPreviewSchema,
  ApplicationSchema,
  ApplicationStatusSchema,
  ApplicationStatusStateSchema,
  AvailabilitySchema,
  CompetenceSchema,
  IncompletePersonSchema,
  OpportunitySchema,
  PersonSchema,
  UserCompetenceSchema,
} from './schemas'
export type Role = 'recruiter' | 'applicant'

export type ApplicationStatusState = z.infer<typeof ApplicationStatusStateSchema>

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>

export type Availability = z.infer<typeof AvailabilitySchema>

export type Opportunity = z.infer<typeof OpportunitySchema>

export type Application = z.infer<typeof ApplicationSchema>

export type Competence = z.infer<typeof CompetenceSchema>

export type UserCompetence = z.infer<typeof UserCompetenceSchema>

export type CompetenceProfile = Array<UserCompetence>

export type Person = z.infer<typeof PersonSchema>

export type IncompletePerson = z.infer<typeof IncompletePersonSchema>

export type ApplicationPreview = z.infer<typeof ApplicationPreviewSchema>

export interface AvailabilityPeriod {
  startDate: Date
  endDate: Date
}
