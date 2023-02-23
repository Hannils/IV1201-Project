import { Box, CircularProgress } from '@mui/material'

/**
 * Component for handling loading
 */
export default function FullPageLoader() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <CircularProgress />
    </Box>
  )
}
