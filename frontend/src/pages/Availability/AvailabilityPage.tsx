import { Box, Divider, LinearProgress, List, Stack, Typography } from '@mui/material'
import React from 'react'

import ErrorHandler from '../../components/ErrorHandler'
import { useAvailability } from './AvailabilityContext'
import AddAvailability from './views/AddAvailability'
import AvailabilityEditor from './views/AvailabilityEditor'

export default function AvailabilityPage() {
  const { availabilities, deleteMutation } = useAvailability()

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h1" gutterBottom>
          Your Availability periods
        </Typography>
        <Typography>Lorem ipsum dolor sit amet</Typography>
      </Box>
      <AddAvailability />
      <Divider />
      <ErrorHandler
        size="large"
        isError={deleteMutation.isError}
        error={deleteMutation.error}
      />
      <List>
        {deleteMutation.isLoading && <LinearProgress />}
        {availabilities.fields.map((period, index) => (
          <AvailabilityEditor key={period.id} {...{ period, index }} />
        ))}
      </List>
    </Stack>
  )
}
