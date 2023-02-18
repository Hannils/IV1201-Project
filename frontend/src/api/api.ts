import axios from 'axios'
import { z } from 'zod'

import {
  ApplicationStatus,
  Availability,
  AvailabilitySchema,
  Competence,
  CompetenceProfile,
  OpportunitySchema,
  Person,
  UserApplication,
  UserCompetence,
} from '../util/Types'

const API_URL = 'http://localhost:8888'

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
   * Function to get all of the registered applications
   * @returns Expected response contains all of the registered applications as {@link UserApplication}[]
   */

  getApplications: async () =>
    axios.get<UserApplication[]>(`${API_URL}/application`).then((res) => res.data),

  /**
   * Function to update an applications status
   * @param data Object containing the new application_status as {@link ApplicationStatus} and a personId as `number`
   * @returns Expects response of 200 OK as `statuscode`
   */
  updateApplicationStatus: async (data: {
    status: ApplicationStatus
    personId: number
  }) => axios.patch(`${API_URL}/application/${data.personId}`, { status: data.status }),

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
   * @param personId Id of the person to insert a user competence for as `number`
   * @returns Expects response of 200 OK as `statuscode`
   */
  createUserCompetence: async (userCompetence: UserCompetence, personId: number) =>
    axios.post(`${API_URL}/competence/${personId}`, userCompetence, {
      ...getAuthedHeaders(),
    }),

  /**
   * Function to delete a user competence from a person
   * @param Object Id of the person as `number` and competenceId as `number`
   * @returns Expected response of 200 OK as `statuscode`
   */
  deleteUserCompetence: async ({
    personId,
    competenceId,
  }: {
    personId: number
    competenceId: number
  }) =>
    axios.delete(`${API_URL}/competence/${personId}/${competenceId}`, {
      ...getAuthedHeaders(),
    }),

  /**
   * Function to update a user competence
   * @param Object Contains personId as `number`, competenceId as `number` and yearsOfExperience as `number`
   * @returns Expected response of 200 OK as `statuscode`
   */
  updateUserCompetence: async ({
    personId,
    competenceId,
    yearsOfExperience,
  }: {
    personId: number
    competenceId: number
    yearsOfExperience: number
  }) =>
    axios.patch(
      `${API_URL}/competence/${personId}/${competenceId}`,
      { yearsOfExperience },
      { ...getAuthedHeaders() },
    ),

  getOpportunities: async () =>
    axios
      .get(`${API_URL}/opportunity`, { ...getAuthedHeaders() })
      .then((res) => z.array(OpportunitySchema).parse(res.data)),
  getOpportunity: async (opportunityId: number) =>
    axios
      .get(`${API_URL}/opportunity/${opportunityId}`, { ...getAuthedHeaders() })
      .then((res) => OpportunitySchema.parse(res.data)),

  getAvailabilityForPerson: async (personId: number) =>
    axios
      .get(`${API_URL}/availability/${personId}`, { ...getAuthedHeaders() })
      .then((res) => z.array(AvailabilitySchema).parse(res.data)),

  createAvailability: async (data: Omit<Availability, 'availabilityId'>) =>
    axios
      .post(`${API_URL}/availability`, data, { ...getAuthedHeaders() })
      .then((res) => AvailabilitySchema.parse(res.data)),
  deleteAvailability: async (availabilityId: number) =>
    axios.delete(`${API_URL}/availability/${availabilityId}`, { ...getAuthedHeaders() }),
}

export default api
