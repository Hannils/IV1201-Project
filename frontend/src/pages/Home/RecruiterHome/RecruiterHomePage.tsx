import {
  Button,
  LinearProgress,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

import { useRecruiterHome } from './RecruiterHomeContext'

/**
 * View For recruiter home
 */
export default function RecruiterHomePage() {
  const { applications, updateMutation, statuses } = useRecruiterHome()
  return (
    <>
      <Typography variant="h5" mb={4}>
        Applications
      </Typography>
      {updateMutation.isLoading && <LinearProgress />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Competences</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.length === 0 && (
            <Typography mt={5} variant="h3">
              No applications yet
            </Typography>
          )}
          {applications.map(({ applicationId, person, competences, status }) => (
            <TableRow key={person.personId}>
              <TableCell>
                {person.firstname} {person.lastname}
              </TableCell>
              <TableCell>
                {competences
                  .map(
                    (profile) =>
                      `${profile.competence.name} for ${profile.yearsOfExperience} years`,
                  )
                  .join(', ')}
              </TableCell>
              <TableCell>
                <TextField
                  value={status.statusId}
                  select
                  disabled={updateMutation.isLoading}
                  onChange={(e) =>
                    updateMutation.mutate({
                      applicationId,
                      statusId: Number(e.target.value),
                    })
                  }
                >
                  {statuses.map(({ statusId, name }) => (
                    <MenuItem key={statusId} value={statusId}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell>
                <Button component={Link} to={`/person/${person.personId}`}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
