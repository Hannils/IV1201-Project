import { Stack, Paper, Typography, List, ListItem, ListItemText } from '@mui/material'
import React from 'react'
import { Application } from '../../../util/Types'

const application: Application = {
  competenceProfile: [
    { competence: 'Good at working', yearsOfExperience: 1 },
    { competence: 'Very good at working', yearsOfExperience: 2 },
    { competence: 'Excellent at working', yearsOfExperience: 3 },
  ],
  status: 'unhandled',
  availability: [{ startDate: new Date('2009-09-09'), endDate: new Date('2009-10-09') }],
}

export default function ApplicantHome() {
  return (
    <Stack direction="column" spacing={3}>
      <Paper>
        <Typography variant="h2">Your application</Typography>
        <Typography>Your competences</Typography>
        <List>
          {application.competenceProfile.map(({ competence, yearsOfExperience }) => (
            <ListItem key={competence}>
              <ListItemText
                primary={competence}
                secondary={`Years of experience: ${yearsOfExperience}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  )
}
