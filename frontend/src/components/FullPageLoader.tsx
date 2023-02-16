import { Box, CircularProgress } from '@mui/material'
import React from 'react'

export default function FullPageLoader() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <CircularProgress />
    </Box>
  )
}
