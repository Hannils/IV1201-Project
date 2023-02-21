import { z } from 'zod'

const RoleSchema = z.enum(['recruiter', 'applicant'])
export type Role = z.infer<typeof RoleSchema>

export const ApplicationStatusStateSchema = z.enum(['unhandled', 'rejected', 'accepted'])

export type ApplicationStatusState = z.infer<typeof ApplicationStatusStateSchema>

export const ApplicationStatusSchema = z.object({
  statusId: z.number(),
  name: ApplicationStatusStateSchema,
})

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>

export const PersonSchema = z.object({
  personId: z.number(),
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  role: RoleSchema,
  email: z.string().email().nullable(),
  personNumber: z.string().nullable(),
})

export type Person = z.infer<typeof PersonSchema>

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

export type ApplicationPreview = z.infer<typeof ApplicationPreviewSchema>
