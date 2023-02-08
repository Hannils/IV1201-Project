import React, { useState, useEffect } from 'react'
import {
  Stack,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import api from '../../../api/api'
import useUser from '../../../util/auth'
import {
  Application,
  UserApplication,
  Person,
  Competence,
  AvailabilityPeriod,
} from '../../../util/Types'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export default function RecruiterHome() {
  return null
  /* const { data: applications, isLoading, isSuccess } = useQuery(['applications'], () =>
    api.getApplications(),
  )
  //const navigate = useNavigate();

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

  if(!isSuccess) {
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
          {applications
            .sort(
              (a, b) =>
                a.competenceProfile[0].yearsOfExperience -
                b.competenceProfile[0].yearsOfExperience,
            )
            .map(({ user, competenceProfile, status }) => (
              <TableRow key={user.personId}>
                <TableCell>
                  {user.firstname} {user.lastname}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {competenceProfile.map((comp) => (
                    <div key={comp.competence}>
                      {comp.competence} ({comp.yearsOfExperience} years)
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Stack>
  ) */
}

