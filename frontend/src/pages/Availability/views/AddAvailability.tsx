import { Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'

import { dateInputFormatter } from '../../../util/IntlFormatters'
import { useAvailability } from '../AvailabilityContext'
import DatePicker from './DatePicker'

/**
 * Component for adding availability
 */
export default function AddAvailability() {
  const {
    createForm: { register, formState, watch },
    createSubmit,
  } = useAvailability()

  const fromDateWatch = watch('fromDate')
  const minToDate = dateInputFormatter.format(
    isNaN(fromDateWatch?.getTime()) ? undefined : fromDateWatch,
  )

  return (
    <Stack spacing={2} component="form" onSubmit={createSubmit} noValidate>
      <Typography variant="h2" gutterBottom>
        Add new availability period
      </Typography>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
        <DatePicker
          {...register('fromDate', { valueAsDate: true })}
          fullWidth
          min={dateInputFormatter.format()}
          TextFieldProps={{
            error: !!formState.errors.fromDate,
            label: 'Start date',
            helperText: formState.errors.fromDate?.message || undefined,
          }}
        />
        <DatePicker
          {...register('toDate', { valueAsDate: true })}
          fullWidth
          min={minToDate}
          TextFieldProps={{
            label: 'End date',
            error: !!formState.errors.toDate,
            helperText: formState.errors.toDate?.message || undefined,
          }}
        />
      </Box>
      {formState.errors.root && (
        <Typography color="error">
          There was an error adding availability period: {formState.errors.root.message}
        </Typography>
      )}
      <Box>
        <Button variant="contained" type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Adding...' : 'Add'}
        </Button>
      </Box>
    </Stack>
  )
}
