import { createContext, useContext, useEffect, useState } from 'react'

import api from '../api/api'
import { Person } from './Types'

const authContext = createContext<
  [Person | null, boolean, React.Dispatch<React.SetStateAction<Person | null>>]
>([null, true, () => null])

const useUser = () => useContext(authContext)

export const AuthProvider = (props: any) => {
  const [user, setUser] = useState<Person | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    api
      .getUser()
      .then((user) => setUser(user))
      .finally(() => setLoading(false))
  }, [])

  return <authContext.Provider {...props} value={[user, loading, setUser]} />
}

export default useUser
