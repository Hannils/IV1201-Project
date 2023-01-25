import { UserRecord } from 'firebase-admin/auth'

export type Role = 'recruiter' | 'applicant'
export type ApplicationStatus = 'unhandled' | 'rejected' | 'approved'

export interface Person extends UserRecord {
  firstname: string
  lastname: string
  personNumber: string
  role: Role
  application?: Application
}

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

