import React, { useState, useEffect } from 'react';
import { Stack, TextField, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import useUser from '../../../util/auth';
import { Application, ApplicationStatus, Person,Competence, AvailabilityPeriod} from '../../../util/Types';
import axios from 'axios';

interface Props {
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
}

export default function RecruiterHome({ applications, setApplications }: Props) {
  const { user, isLoading } = useUser();
  //const navigate = useNavigate();

  useEffect(() => {
    if (!user || isLoading) {
      return;
    }

    axios.get('/applications').then((res: { data: React.SetStateAction<Application[]>; }) => {
      setApplications(res.data);
    });
  }, [user, isLoading, setApplications]);

  if (!user || isLoading) {
    return <div>Loading...</div>;
  }

  const handleAccept = (app: Application) => {
    axios.patch(`/applications/${app.personId}`, { status: 'approved' }).then((res) => {
      setApplications(
        applications.map((a) => (a.personId === app.personId ? { ...a, status: 'approved' } : a))
      );
    });
  };

  const handleReject = (app: Application) => {
    axios.patch(`/applications/${app.personId}`, { status: 'rejected' }).then((res) => {
      setApplications(
        applications.map((a) => (a.personId === app.personId ? { ...a, status: 'rejected' } : a))
      );
    });
  };

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
            .sort((a, b) => a.competenceProfile[0].yearsOfExperience - b.competenceProfile[0].yearsOfExperience)
            .map((app) => (
              <TableRow key={app.personId}>
                <TableCell>
                  <RouterLink to={`/applicants/${app.personId}`}>{app.username}</RouterLink>
                </TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>
                  {app.competenceProfile.map((comp) => (
                    <div key={comp.competence}>
                      {comp.competence} ({comp.yearsOfExperience} years)
                    </div>
                  ))}
                </TableCell>
              </TableRow>))}
          </TableBody>
      </Table>
    </Stack> );}
