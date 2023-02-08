import { Box, CircularProgress, Typography } from '@mui/material'
import { createContext, FunctionComponent, useContext } from 'react'
import { Navigate } from 'react-router-dom'

import useUser from '../util/auth'
import { Person } from '../util/Types'

interface WithAuthInterface {
  Page: FunctionComponent
  allowedRoles?: string[]
}

const authedUserContext = createContext<Person>({} as Person)

export const useAuthedUser = () => useContext(authedUserContext)

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
        <Typography variant="h1">Forbidden</Typography>
      </Box>
    )

  return (
    <authedUserContext.Provider value={user}>
      <Page />
    </authedUserContext.Provider>
  )
}

export default WithAuth
