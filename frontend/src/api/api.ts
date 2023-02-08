// Description: This file contains all the API calls to the backend server and is used by the frontend to communicate with the backend.
//The API calls are made using the axios library.

import axios from 'axios'

import {
  ApplicationStatus,
  Competence,
  CompetenceProfile,
  Person,
  UserApplication,
  UserCompetence,
} from '../util/Types'

const API_URL = 'http://localhost:8888'

// Types
interface SignUpRequest {
  firstname: string
  lastname: string
  email: string
  username: string
  password: string
  personNumber: string
}

interface SignInRequest {
  username: string
  password: string
}

export interface AuthResponse {
  user: Person
  token: string
}

interface UpdateAccountRequest {
  username: string
  profilePicture?: string
}

interface UpdateUserResponse {
  username: string
  profilePicture?: string
}

interface CreateDocumentResponse {
  documentId: string | number
}

interface GetUserRequest {
  uid?: string
  phoneNumber?: string
  email?: string
}

// this function is used to get the token from the local storage and add it to the headers of the request
function getAuthedHeaders() {
  return { headers: { Authorization: window.localStorage.getItem('token') } }
}
// api calls to the backend server
const api = {
  /* Users */
  signUp: ({
    firstname,
    lastname,
    email,
    username,
    password,
    personNumber,
  }: SignUpRequest) =>
    axios
      .post<AuthResponse>(`${API_URL}/user`, {
        firstname,
        lastname,
        email,
        username,
        password,
        personNumber,
      })
      .then(({ data }) => {
        window.localStorage.setItem('token', data.token)
        return data.user
      }),
  // sign in to the application
  signIn: async ({ username, password }: SignInRequest) =>
    axios
      .post<AuthResponse>(`${API_URL}/user/signin`, {
        username,
        password,
      })
      .then(({ data }) => {
        window.localStorage.setItem('token', data.token)
        return data.user
      }),
  getMigrationToken: async ({ email }: { email: string }) =>
    axios.post(`${API_URL}/user-migration/token`, { email }),

  validateMigrationToken: async ({ token }: { token: string }) =>
    axios.get(`${API_URL}/user-migration/token/${token}`),

  migrateUser: async (data: { token: string; username: string; password: string }) =>
    axios.put<AuthResponse>(`${API_URL}/user-migration`, data).then(({ data }) => {
      window.localStorage.setItem('token', data.token)
      return data.user
    }),
  getUser: async () =>
    axios
      .get<Person>(`${API_URL}/user`, { ...getAuthedHeaders() })
      .then((res) => res.data),

  /* Applications */

  getApplications: async () =>
    axios.get<UserApplication[]>(`${API_URL}/application`).then((res) => res.data),
  updateApplicationStatus: async (data: {
    status: ApplicationStatus
    personId: number
  }) => axios.patch(`${API_URL}/application/${data.personId}`, { status: data.status }),

  /* Competence */

  getCompetences: async () =>
    axios.get<Competence[]>(`${API_URL}/competence`).then((res) => res.data),
  getCompetenceProfile: async (personId: number) =>
    axios
      .get<CompetenceProfile>(`${API_URL}/competence/${personId}`, {
        ...getAuthedHeaders(),
      })
      .then((res) => res.data),

  createUserCompetence: async (userCompetence: UserCompetence, personId: number) =>
    axios.post(`${API_URL}/competence/${personId}`, userCompetence, {
      ...getAuthedHeaders(),
    }),
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
}

export default api
