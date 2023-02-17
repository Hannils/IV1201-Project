import { Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'

import DatePicker from './DatePicker'

export default function AddAvailability() {
  return (
    <Stack spacing={2}>
      <Typography variant="h2">Add new availability period</Typography>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
        <DatePicker TextFieldProps={{ label: 'Start date', fullWidth: true }} />
        <DatePicker TextFieldProps={{ label: 'End date', fullWidth: true }} />
      </Box>
      <Box>
        <Button variant="contained">Add</Button>
      </Box>
    </Stack>
  )
}
