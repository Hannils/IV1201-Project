import { Box, CircularProgress, Typography } from '@mui/material'
import { createContext, FunctionComponent, useContext } from 'react'
import { Navigate } from 'react-router-dom'

import useUser from '../util/auth'
import { Person } from '../util/Types'

/**
 * - Page: The page to render if the user is authenticated
 * - allowedRoles (optional): a list of user roles that can access the page
 */
interface WithAuthInterface {
  Page: FunctionComponent
  allowedRoles?: string[]
}

/**
 * A user context to be used within the component to have easy access to the currently logged in user.
 */
const authedUserContext = createContext<Person>({} as Person)

/**
 * Custom hook to get access to the currently logged in user
 */
export const useAuthedUser = () => useContext(authedUserContext)

/**
 * Render components inside this function to make sure people are authenticated.
 * @param WithAuthProps available props {@link WithAuthInterface}
 */
function WithAuth({ Page, allowedRoles }: WithAuthInterface) {
  const [user, loading] = useUser()

  if (loading)
    return (
      <Box sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  if (user === null) return <Navigate to="/signin" />

  if (allowedRoles !== undefined && !allowedRoles.includes(user.role))
    return (
      <Box sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}>
        <Typography variant="h1">You do not have access to this page</Typography>
      </Box>
    )

  return (
    <authedUserContext.Provider value={user}>
      <Page />
    </authedUserContext.Provider>
  )
}

export default WithAuth
