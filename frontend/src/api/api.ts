import axios from 'axios'
import { Person } from '../util/Types'

const API_URL = 'http://localhost:8888'

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

interface AuthResponse {
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

function getAuthedHeaders() {
  return { headers: { Authorization: window.localStorage.getItem('token') } }
}

const api = {
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

  getUser: async () =>
    axios
      .get<Person>(`${API_URL}/user`, { ...getAuthedHeaders() })
      .then((res) => res.data),
}

export default api
