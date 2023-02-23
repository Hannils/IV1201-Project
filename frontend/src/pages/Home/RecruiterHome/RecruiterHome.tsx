import { Box, MenuItem, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { Fragment, useState } from 'react'

import api from '../../../api/api'
import ErrorHandler from '../../../components/ErrorHandler'
import FullPageLoader from '../../../components/FullPageLoader'
import RecruiterHomeProvider from './RecruiterHomeContext'
import RecruiterHomePage from './RecruiterHomePage'

/**
 * Presenter for recruiter home
 */
export default function RecruiterHome() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null)
  const opportunitiesQuery = useQuery(['opportunity'], () => api.getOpportunities(), {
    onSuccess: (data) => setSelectedOpportunity(data.at(0)?.opportunityId || null),
  })

  const statusesQuery = useQuery(['status'], () => api.getApplicationStatuses())

  const applicationsQuery = useQuery(
    ['applicationsPreview', selectedOpportunity],
    async () => api.getApplicationsPreview(selectedOpportunity as number),
    { enabled: selectedOpportunity !== null },
  )

  if (opportunitiesQuery.isLoading) return <FullPageLoader />

  if (opportunitiesQuery.isError)
    return <ErrorHandler size="large" isError={true} error={opportunitiesQuery.error} />

  if (selectedOpportunity === null)
    return <Typography>No opportunities available</Typography>

  return (
    <Stack>
      <Box>
        <TextField
          select
          value={selectedOpportunity}
          onChange={(e) => setSelectedOpportunity(Number(e.target.value))}
          sx={{ mb: 3 }}
        >
          {opportunitiesQuery.data.map(({ opportunityId, name }) => (
            <MenuItem key={opportunityId} value={opportunityId}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <ErrorHandler
        size="large"
        isError={applicationsQuery.isError}
        error={applicationsQuery.error}
      />
      <ErrorHandler
        size="large"
        isError={statusesQuery.isError}
        error={statusesQuery.error}
      />

      {(applicationsQuery.isLoading || statusesQuery.isLoading) && (
        <>
          <Skeleton variant="text" />
          <Skeleton height="100px" />
        </>
      )}

      {statusesQuery.isSuccess && applicationsQuery.isSuccess && (
        <RecruiterHomeProvider
          statuses={statusesQuery.data}
          applications={applicationsQuery.data}
          selectedOpportunity={selectedOpportunity}
        >
          <RecruiterHomePage />
        </RecruiterHomeProvider>
      )}
    </Stack>
  )
}
