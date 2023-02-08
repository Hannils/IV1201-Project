import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import api from '../../../api/api'
import { UserApplication } from '../../../util/Types'

export default function RecruiterHome() {
  const {
    data: applications,
    isLoading,
    isSuccess,
  } = useQuery(
    ['applications'],
    () => [] as UserApplication[] /* api.getApplications() */,
  )

  const handleAccept = (application: UserApplication) => {
    api.updateApplicationStatus({
      status: 'approved',
      personId: application.user.personId,
    })
  }

  const handleReject = (application: UserApplication) => {
    api.updateApplicationStatus({
      status: 'rejected',
      personId: application.user.personId,
    })
  }

  if (isLoading) {
    return <CircularProgress />
  }

  if (!isSuccess) {
    return <p>Something bad happened</p>
  }

  return (
    <Stack>
      <Typography variant="h5">Applications</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Competences</TableCell>
            <TableCell>Availability</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map(({ user, competenceProfile, status }) => (
            <TableRow key={user.personId}>
              <TableCell>
                {user.firstname} {user.lastname}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {competenceProfile.map((profile) => (
                  <div key={profile.competence.competenceId}>
                    {profile.competence.name} ({profile.yearsOfExperience} years)
                  </div>
                ))}
              </TableCell>
              <TableCell>Avaiability</TableCell>
              <TableCell>{status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}
