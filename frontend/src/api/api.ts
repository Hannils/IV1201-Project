import axios from 'axios'
import { User } from 'firebase/auth'

//import { Document, DocumentPreview } from '../util/Types'
import { auth } from './firebase'

const API_URL = 'http://localhost:8888'

interface SignUpRequest {
  firstname: string
  lastname: string
  email: string
  username: string
  password: string
}

interface UpdateAccountRequest {
  username: string
  profilePicture?: string
}

interface SignUpResponse {
  signInToken: string
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

async function getAuthedHeaders() {
  return { headers: { Authorization: await auth.currentUser?.getIdToken(false) } }
}

const api = {
  signUp: ({ firstname, lastname, email, username, password }: SignUpRequest) =>
    axios.post<SignUpResponse>(`${API_URL}/user`, {
      firstname,
      lastname,
      email,
      username,
      password,
    }),

  updateAccount: async ({ username, profilePicture }: UpdateAccountRequest) => {
    return axios.patch<UpdateUserResponse>(
      `${API_URL}/user`,
      {
        username,
        profilePicture,
      },
      { ...(await getAuthedHeaders()) },
    )
  },
}

export default api
