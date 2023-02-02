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

const application: Application = {
  competenceProfile: [
    //{ competence: 'Good at working', yearsOfExperience: 1 },
    //{ competence: 'Very good at working', yearsOfExperience: 2 },
    //{ competence: 'Excellent at working', yearsOfExperience: 3 },
  ],
  status: 'unhandled',
  availability: [{ startDate: new Date('2009-09-09'), endDate: new Date('2009-10-09') }],
}

const competences = ['Cash register', 'Restocking', 'IDK example maybe']

export default function ApplicantHome() {
  const [competenceName, setCompetenceName] = React.useState<string[]>([])

  const handleChange = (event: SelectChangeEvent<typeof competenceName>) => {
    const {
      target: { value },
    } = event;
    setCompetenceName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  return (
    <Stack direction="column" spacing={3}>
      <Card sx={{}}>
        <CardContent>
          {application.competenceProfile.length === 0 ? (
            <FormControl sx={{m: 1, width: 300}}>
              <InputLabel id="label">Competences</InputLabel>
              <Select multiple value={competenceName} onChange={handleChange}>
                {competences.map((competence) => (
                  <MenuItem key={competence} value={competence}>
                    <Checkbox checked={competenceName.indexOf(competence) > -1} />
                    <ListItemText primary={competence} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <List>
              <Typography variant="h2">Your application</Typography>
              <Typography>Your competences</Typography>
              {application.competenceProfile.map(({ competence, yearsOfExperience }) => (
                <ListItem key={competence} disableGutters>
                  <ListItemText
                    primary={competence}
                    secondary={`Years of experience: ${yearsOfExperience}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Stack>
  )
}
