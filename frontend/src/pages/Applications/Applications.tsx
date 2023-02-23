import { Box, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router-dom'

import api from '../../api/api'
import ErrorHandler from '../../components/ErrorHandler'
import FullPageLoader from '../../components/FullPageLoader'

/**
 * Component for rendering applications
 */
export default function Applications() {
  const {
    data: applications,
    isLoading,
    isError,
    error,
  } = useQuery(['application'], () => api.getApplications())

  if (isLoading) return <FullPageLoader />
  if (isError) return <ErrorHandler size="large" isError={true} error={error} />

  console.log(applications)
  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h1" gutterBottom>
          Your applications
        </Typography>
        <Typography>Lorem ipsum dolor sit amet</Typography>
      </Box>
      <List>
        {applications.map(({ status, applicationId, opportunity }) => (
          <ListItemButton
            key={applicationId}
            component={Link}
            to={`/opportunity/${opportunity.opportunityId}`}
          >
            <ListItemText primary={opportunity.name} secondary={`Status: ${status.name}`} />
          </ListItemButton>
        ))}
      </List>
    </Stack>
  )
}
