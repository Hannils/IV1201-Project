import { Container, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import React from 'react'

import { Availability, CompetenceProfile, Person } from '../../util/Types'

interface ViewPersonPageProps {
  person: Person
  availability: Availability[]
  competences: CompetenceProfile
}

export default function ViewPersonPage({
  person,
  availability,
  competences,
}: ViewPersonPageProps) {
  return (
    <Container disableGutters maxWidth="sm">
      <Stack>
        <Typography variant="h1">
          About {person.firstname} {person.lastname}
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Email address"
              secondary={person.email || 'No email available'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Person number"
              secondary={person.personNumber || 'No person number available'}
            />
          </ListItem>
        </List>
        <Typography variant="h2">Competences</Typography>
        <List>
          {competences.map(({ competence, yearsOfExperience }) => (
            <ListItem key={competence.competenceId}>
              <ListItemText
                primary={competence.name}
                secondary={yearsOfExperience + ' years of experience'}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h2">Availability periods</Typography>
        <List>
          {availability.map(({ availabilityId, fromDate, toDate }) => (
            <ListItem key={availabilityId}>
              <ListItemText
                primary={
                  fromDate.toLocaleDateString('en-GB') +
                  ' - ' +
                  toDate.toLocaleDateString('en-GB')
                }
              />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Container>
  )
}
