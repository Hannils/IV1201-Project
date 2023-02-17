import { Button, List } from '@mui/material'
import React from 'react'

import { useAuthedUser } from '../../components/WithAuth'
import { useAvailability } from './AvailabilityContext'
import AvailabilityEditor from './views/AvailabilityEditor'

export default function AvailabilityPage() {
  const user = useAuthedUser()
  const { availabilities } = useAvailability()

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => availabilities.append({ personId: user.personId })}
      >
        Add period
      </Button>
      <List>
        {availabilities.fields.map((period, index) => (
          <AvailabilityEditor key={period.id} {...{ period, index }} />
        ))}
      </List>
    </div>
  )
}
