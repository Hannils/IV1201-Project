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
  competenceProfile: Array<Competence>
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

export type CompetenceProfile = Array<{
  competence: Competence
  yearsOfExperience: number
}>

export interface AvailabilityPeriod {
  startDate: Date
  endDate: Date
}
