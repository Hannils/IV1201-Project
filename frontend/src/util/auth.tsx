import { CircularProgress } from '@mui/material'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { Person } from './Types'

const authContext = createContext<
  [Person | null, boolean, React.Dispatch<React.SetStateAction<Person | null>>]
>([null, true, () => null])

const useUser = () => useContext(authContext)
const Provider = authContext.Provider

export const AuthProvider = (props: any) => {
  const [user, setUser] = useState<Person | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    api
      .getUser()
      .then((user) => setUser(user))
      .finally(() => setLoading(false))
  }, [])


  return <Provider {...props} value={[user, loading, setUser]} />
}

export default useUser
