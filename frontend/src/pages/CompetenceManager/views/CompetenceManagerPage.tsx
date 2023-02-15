import { AddRounded } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import api from '../../../api/api'
import { useAuthedUser } from '../../../components/WithAuth'
import { Competence, CompetenceProfile, UserCompetence } from '../../../util/Types'
import CompetenceManagerTable from './CompetenceManagerTable'
import { FormValues } from '../CompetenceManagerTypes'
import { useCompetenceManager } from '../CompetenceManagerContext'
import CompetenceManagerAddNew from './CompetenceManagerAddNew'

export default function CompetenceManagerPage() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h1" gutterBottom>
        Your competences
      </Typography>
      <CompetenceManagerAddNew />
      <CompetenceManagerTable />
    </Stack>
  )
}
