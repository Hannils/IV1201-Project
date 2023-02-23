import { Stack, Typography } from '@mui/material'
import React from 'react'

import CompetenceManagerAddNew from './CompetenceManagerAddNew'
import CompetenceManagerTable from './CompetenceManagerTable'

/**
 * Main view for competence manager
 */
export default function CompetenceManagerPage() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h1" gutterBottom>
        Your competences
      </Typography>
      <CompetenceManagerAddNew />
      <CompetenceManagerTable />
    </Stack>
  )
}
