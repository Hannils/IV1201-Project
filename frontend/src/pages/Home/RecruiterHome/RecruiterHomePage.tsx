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
import React, { ChangeEventHandler, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorHandler from '../../../components/ErrorHandler'
import { ApplicationPreview } from '../../../util/Types'

import { useRecruiterHome } from './RecruiterHomeContext'

/**
 * View For recruiter home
 */
export default function RecruiterHomePage() {
  const { applications, updateMutation } = useRecruiterHome()
  return (
    <>
      <Typography variant="h5" mb={4}>
        Applications
      </Typography>
      {updateMutation.isLoading && <LinearProgress />}
      <ErrorHandler
        size="large"
        isError={updateMutation.isError}
        error={updateMutation.error}
      />
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
          {applications.map((application) => (
            <RecruiterHomeTableRow
              key={application.applicationId}
              application={application}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

interface RecruiterHomeTableRowProps {
  application: ApplicationPreview
}

function RecruiterHomeTableRow(props: RecruiterHomeTableRowProps) {
  const { applicationId, person, competences, status } = props.application
  const { updateMutation, statuses } = useRecruiterHome()

  const handleUpdateState: ChangeEventHandler<HTMLInputElement> = (e) => {
    updateMutation.mutate({
      applicationId,
      oldStatusId: status.statusId,
      newStatusId: Number(e.target.value),
    })
  }

  return (
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
          onChange={handleUpdateState}
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
  )
}
