import { DeleteRounded } from '@mui/icons-material'
import { IconButton, ListItem, ListItemText } from '@mui/material'
import React from 'react'
import { FieldArrayWithId } from 'react-hook-form'

import { AvailabilitiesFormData, useAvailability } from '../AvailabilityContext'

interface AvailabilityEditorProps {
  period: FieldArrayWithId<AvailabilitiesFormData, 'availabilities', 'id'>
  index: number
}

export default function AvailabilityEditor({ period, index }: AvailabilityEditorProps) {
  const { deleteMutation } = useAvailability()
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="Remove availabilityPeriod"
          disabled={deleteMutation.isLoading}
          onClick={() =>
            deleteMutation.mutate({ availabilityId: period.availabilityId, index })
          }
        >
          <DeleteRounded />
        </IconButton>
      }
    >
      <ListItemText
        primary={`${period.fromDate.toLocaleDateString()} - ${period.toDate.toLocaleDateString()}`}
      />
    </ListItem>
  )
}
