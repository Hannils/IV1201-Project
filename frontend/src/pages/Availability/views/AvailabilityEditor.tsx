import { Button, ListItem, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import { FieldArrayWithId, useFormContext } from 'react-hook-form'

import { dateInputFormatter } from '../../../util/IntlFormatters'
import { FormData } from '../AvailabilityContext'
import DatePicker from './DatePicker'

interface AvailabilityEditorProps {
  period: FieldArrayWithId<FormData, 'availabilities', 'id'>
  index: number
}

export default function AvailabilityEditor({ period, index }: AvailabilityEditorProps) {
  const namePrefix = `availabilities.${index}`

  const { register, watch } = useFormContext()
  const [isEditing, setIsEditing] = useState(false)

  const fromDateWatch = watch(namePrefix + '.fromDate', period.fromDate)
  const toDateWatch = watch(namePrefix + '.toDate', period.toDate)

  const minDate = dateInputFormatter.format()
  const endDateLimit = dateInputFormatter.format(fromDateWatch)

  if (period.availabilityId !== undefined && !isEditing)
    return (
      <ListItem>
        <ListItemText
          primary={`${fromDateWatch.toLocaleDateString()} - ${toDateWatch.toLocaleDateString()}`}
        />
      </ListItem>
    )

  return (
    <ListItem sx={{ gap: 4 }}>
      <DatePicker
        {...register(`availabilities.${index}.fromDate`, { valueAsDate: true })}
        min={minDate}
        fullWidth
        TextFieldProps={{ label: 'Start date' }}
      />
      <DatePicker
        {...register(`availabilities.${index}.toDate`, { valueAsDate: true })}
        min={endDateLimit}
        fullWidth
        TextFieldProps={{ label: 'End date' }}
      />
      <Button>Save</Button>
    </ListItem>
  )
}
