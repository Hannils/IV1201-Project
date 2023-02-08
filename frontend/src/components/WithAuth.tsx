import { Box, CircularProgress, Typography } from '@mui/material'
import { FunctionComponent } from 'react'
import { Navigate } from 'react-router-dom'

import useUser from '../util/auth'

interface WithAuthInterface {
  Page: FunctionComponent
  allowedRoles?: string[]
}

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

  return <Page />
}

export default WithAuth
