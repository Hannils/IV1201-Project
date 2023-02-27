import axios from 'axios'
import { z } from 'zod'

import {
  Application,
  ApplicationPreview,
  ApplicationSchema,
  ApplicationStatus,
  Availability,
  AvailabilitySchema,
  Competence,
  CompetenceProfile,
  OpportunitySchema,
  Person,
  UserCompetence,
} from '../util/Types'

const API_URL = import.meta.env.VITE_API_URL

/**
 * - firstname as `string`
 * - lastname as `string`
 * - email as `string`
 * - username as `string`
 * - password as `string`
 * - personNumber as `string`
 */
interface SignUpRequest {
  firstname: string
  lastname: string
  email: string
  username: string
  password: string
  personNumber: string
}

/**
 * - username as `string`
 * - password as `string`
 */
interface SignInRequest {
  username: string
  password: string
}

/**
 * - user as {@link Person}
 * - token a `string` token to be used for accessing protected endpoints
 */
export interface AuthResponse {
  user: Person
  token: string
}

/**
 * Function used to get the token from the local storage
 * @returns headers object with authorization token
 */
function getAuthedHeaders() {
  return { headers: { Authorization: window.localStorage.getItem('token') } }
}

const api = {
  /**
   * Function to send sign up request
   * @param signUpParams Information needed for sign-up request as {@link SignInRequest}
   * @returns Expects response containing information about the user that signed up as {@link Person}
   */
  signUp: (signUpParams: SignUpRequest) =>
    axios.post<AuthResponse>(`${API_URL}/user`, signUpParams).then(({ data }) => {
      window.localStorage.setItem('token', data.token)
      return data.user
    }),

  /**
   * Function to send sign in request
   * @param signInParams Information needed for signing in a user as {@link SignInRequest}
   * @returns Expects response containing information about the user that signed in as {@link Person}
   */
  signIn: async (signInParams: SignInRequest) =>
    axios.post<AuthResponse>(`${API_URL}/user/signin`, signInParams).then(({ data }) => {
      window.localStorage.setItem('token', data.token)
      return data.user
    }),

  /**
   * Function to send sign out request
   * @returns Promise that resolves if sign out was successful
   */
  signOut: async () =>
    axios
      .post(`${API_URL}/user/signout`, null, { ...getAuthedHeaders() })
      .then(() => window.localStorage.removeItem('token')),

  /**
   * Function to send request to get a migration token
   * @param email User email that the token will correspond to as `string`
   * @returns Expects response containing token for migrating user as `string`
   */
  getMigrationToken: async (email: string) =>
    axios.post(`${API_URL}/user-migration/token`, { email }),

  /**
   * Function to validate an entered migration token
   * @param token The token to check validity of as `string`
   * @returns Expected response is 200 OK as `statuscode`
   */
  validateMigrationToken: async (token: string) =>
    axios.get(`${API_URL}/user-migration/token/${token}`),

  /**
   * Function to migrate a pre-existing user from the old db to the new db
   * @param migratingUserObject Object containing token, new username and new password of the migrating user
   * @returns Expected response is the migrated user as {@link Person}
   */
  migrateUser: async (migratingUserObject: {
    token: string
    username: string
    password: string
  }) =>
    axios
      .put<AuthResponse>(`${API_URL}/user-migration`, migratingUserObject)
      .then(({ data }) => {
        window.localStorage.setItem('token', data.token)
        return data.user
      }),

  /**
   * Function to get the currently authenticated user
   * @returns Expected response contains the authenticated user as {@link Person}
   */
  getUser: async () =>
    axios
      .get<Person>(`${API_URL}/user`, { ...getAuthedHeaders() })
      .then((res) => res.data),

  /**
   * Function to get the currently authenticated user
   * @param personId Id of user to get
   * @returns Expected response contains the authenticated user as {@link Person}
   */
  getUserWithPersonId: async (personId: number) =>
    axios
      .get<Person>(`${API_URL}/user/${personId}`, { ...getAuthedHeaders() })
      .then((res) => res.data),
  /**
   * Function to update an applications status
   * @param data Object containing the new applicationStatus id as `number` and a applcationId as `number`
   * @returns Expects response of 200 OK as `statuscode`
   */
  updateApplicationStatus: async ({
    newStatusId,
    oldStatusId,
    applicationId,
  }: {
    newStatusId: number
    oldStatusId: number
    applicationId: number
  }) =>
    axios.patch(
      `${API_URL}/application/status/${applicationId}`,
      { newStatusId, oldStatusId },
      {
        ...getAuthedHeaders(),
      },
    ),

  /**
   * Function to get all registered competences
   * @returns Expected response contains all registered competences as {@link Competece}[]
   */
  getCompetences: async () =>
    axios.get<Competence[]>(`${API_URL}/competence`).then((res) => res.data),

  /**
   * Function to get a specific competence profile
   * @param personId Id of the person that the competence profile corresponds to as `number`
   * @returns Expected response containing a competence profile as {@link CompetenceProfile}
   */
  getCompetenceProfile: async (personId: number) =>
    axios
      .get<CompetenceProfile>(`${API_URL}/competence/${personId}`, {
        ...getAuthedHeaders(),
      })
      .then((res) => res.data),

  /**
   * Function to create a new user competence for a specific user
   * @param userCompetence New user competence to insert as {@link UserCompetence}
   * @returns Expects response of 200 OK as `statuscode`
   */
  createUserCompetence: async (userCompetence: UserCompetence) =>
    axios.post(`${API_URL}/competence`, userCompetence, {
      ...getAuthedHeaders(),
    }),

  /**
   * Function to delete a user competence from a person
   * @param competenceId Id of the competence as `number`
   * @returns Expected response of 200 OK as `statuscode`
   */
  deleteUserCompetence: async (competenceId: number) =>
    axios.delete(`${API_URL}/competence/${competenceId}`, {
      ...getAuthedHeaders(),
    }),

  /**
   * Function to update a user competence
   * @param Object Contains personId as `number`, competenceId as `number` and yearsOfExperience as `number`
   * @returns Expected response of 200 OK as `statuscode`
   */
  updateUserCompetence: async ({
    competenceId,
    yearsOfExperience,
  }: {
    competenceId: number
    yearsOfExperience: number
  }) =>
    axios.patch(
      `${API_URL}/competence/${competenceId}`,
      { yearsOfExperience },
      { ...getAuthedHeaders() },
    ),

  /**
   * Function to get all opportunities
   * @returns Expected response of all opportunities as {@link Opportunity}[]
   */
  getOpportunities: async () =>
    axios
      .get(`${API_URL}/opportunity`, { ...getAuthedHeaders() })
      .then((res) => z.array(OpportunitySchema).parse(res.data)),

  /**
   * Function to get a specific opportunity
   * @param opportunityId Id of the opportunity to get as `number`
   * @returns Expected response of a specific opportunity as {@link Opportunity}
   */
  getOpportunity: async (opportunityId: number) =>
    axios
      .get(`${API_URL}/opportunity/${opportunityId}`, { ...getAuthedHeaders() })
      .then((res) => OpportunitySchema.parse(res.data)),

  /**
   * Fuction to get all availabilities for a specific person
   * @param personId Id of the person that the availabilites are related to as `number`
   * @returns Expected response of All availabilites for a person as {@link Availability}[]
   */
  getAvailabilityForPerson: async (personId: number) =>
    axios
      .get(`${API_URL}/availability/${personId}`, { ...getAuthedHeaders() })
      .then((res) => z.array(AvailabilitySchema).parse(res.data)),

  /**
   * Function to create a new availability
   * @param data Object containing personId as `number`, fromDate as `Date` and toDate as `Date`
   * @returns Expected response of 200 as `statuscode`
   */
  createAvailability: async (data: Omit<Availability, 'availabilityId'>) =>
    axios
      .post(`${API_URL}/availability/${data.personId}`, data, { ...getAuthedHeaders() })
      .then((res) => AvailabilitySchema.parse(res.data)),

  /**
   * Function to delete a specific availability
   * @param availabilityId Id of the availability to delete as `number`
   * @returns Expected response of 200 as `statuscode`
   */
  deleteAvailability: async (availabilityId: number) =>
    axios.delete(`${API_URL}/availability/${availabilityId}`, { ...getAuthedHeaders() }),

  /**
   * Function to create a new application
   * @param opportunityId Id of the opportunity that the application relates to.
   * @returns Expected response of 200 as `statuscode`
   */
  createApplication: async (opportunityId: number) =>
    axios.post(`${API_URL}/application/${opportunityId}`, undefined, {
      ...getAuthedHeaders(),
    }),
  /**
   * Function to get a specific application from a person from a specific opportunity
   * @param opportunityId Id of the opportunity the application relates to.
   * @returns Expected respone of an application as {@link Application}
   */
  getApplication: async (opportunityId: number) =>
    axios
      .get<Application | null>(`${API_URL}/application/${opportunityId}`, {
        ...getAuthedHeaders(),
      })
      .then(({ data }) => (data === null ? null : ApplicationSchema.parse(data))),
  /**
   * Function to get all applications
   * @returns Expected response of all application as {@link Application}[]
   */
  getApplications: async () =>
    axios
      .get<Application | null>(`${API_URL}/application`, {
        ...getAuthedHeaders(),
      })
      .then(({ data }) => z.array(ApplicationSchema).parse(data)),

  /**
   * Function to get all application previews for a specific opportunity
   * @param opportunityId Id of the opportunity that the application previews relates to
   * @returns Expected response of all application previews of specific opportunity as {@link ApplicationPreview}[]
   */
  getApplicationsPreview: async (opportunityId: number) =>
    axios
      .get<ApplicationPreview[]>(`${API_URL}/application/preview/${opportunityId}`, {
        ...getAuthedHeaders(),
      })
      .then((res) => res.data),

  /**
   * Function to get all application statuses
   * @returns Expected response of all application statuses as {@link ApplicationStatus}[]
   */
  getApplicationStatuses: async () =>
    axios
      .get<ApplicationStatus[]>(`${API_URL}/application-status`, {
        ...getAuthedHeaders(),
      })
      .then((res) => res.data),
}

export default api
