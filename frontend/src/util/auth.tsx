import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import api from '../api/api'
import { Person } from './Types'

type SetUserHandler = (user: Person | null) => void

/**
 * The accessible data from the provided context
 */
type AuthContextData = [Person | null, boolean, SetUserHandler]

/**
 * Authcontext, context to keep track of user in both
 * an authenticated, and unauthenticated state
 */
const authContext = createContext<AuthContextData>([null, true, () => null])

/**
 * Custom hook to access current user data
 */
const useUser = () => useContext(authContext)

/**
 * Provider for the {@link authContext}
 */
export const AuthProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState<Person | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    api
      .getUser()
      .then((user) => setUser(user))
      .finally(() => setLoading(false))
  }, [])

  const handleSetUser: SetUserHandler = (user) => setUser(user)

  return <authContext.Provider {...props} value={[user, loading, handleSetUser]} />
}

export default useUser
