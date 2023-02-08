import {
  Stack,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material'
import React from 'react'
import { Application, Competence } from '../../../util/Types'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../../api/api'

const application: Application = {
  competenceProfile: [
    //{ competence: 'Good at working', yearsOfExperience: 1 },
    //{ competence: 'Very good at working', yearsOfExperience: 2 },
    //{ competence: 'Excellent at working', yearsOfExperience: 3 },
  ],
  status: 'unhandled',
  availability: [{ startDate: new Date('2009-09-09'), endDate: new Date('2009-10-09') }],
}

export default function ApplicantHome() {
  return (
    <Stack direction="column" spacing={3}>
      <Card>
        <CardContent>
          <Link to="/competences">Manage competence profile</Link>
          <List>
            {/* <Typography variant="h2">Your application</Typography>
              <Typography>Your competences</Typography>
              {application.competenceProfile.map(({ competence, yearsOfExperience }) => (
                <ListItem key={competence} disableGutters>
                  <ListItemText
                    primary={competence}
                    secondary={`Years of experience: ${yearsOfExperience}`}
                  />
                </ListItem>
              ))} */}
          </List>
        </CardContent>
      </Card>
    </Stack>
  )
}
