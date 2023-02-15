import { DeleteRounded } from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  InputBase,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'

import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { FieldArrayWithId, FieldPath, useFormContext } from 'react-hook-form'

import api from '../../../api/api'
import { useAuthedUser } from '../../../components/WithAuth'
import { validateWithZod, yearsOfExperienceSchema } from '../../../util/schemas'
import { FormValues } from '../CompetenceManagerTypes'
import { UserCompetence } from '../../../util/Types'
import { useCompetenceManager } from '../CompetenceManagerContext'
import { ZodError } from 'zod'

export default function CompetenceManagerTable() {
  const { competences } = useCompetenceManager()

  console.log(competences)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 450 }} aria-label="Table of competences">
        <TableHead>
          <TableRow>
            <TableCell width={400}>Competence</TableCell>
            <TableCell width={300}>Years&nbsp;of&nbsp;experience</TableCell>
            <TableCell padding="checkbox"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {competences.map((userCompetence, index) => (
            <CompetenceTableRow
              key={userCompetence.competence.competenceId}
              {...{ userCompetence, index }}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

interface CompetenceTableRowProps {
  userCompetence: UserCompetence
}

function CompetenceTableRow(props: CompetenceTableRowProps) {
  const { userCompetence } = props
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(
    userCompetence.yearsOfExperience,
  )

  const [localError, setLocalError] = useState<null | string>(null)

  console.log(userCompetence.competence.name, yearsOfExperience)

  const { deleteMutation, updateMutation } = useCompetenceManager()

  console.log(updateMutation.context, deleteMutation.context)

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setYearsOfExperience(e.target.valueAsNumber)

  const handleUpdate = () => {
    setLocalError(null)
    try {
      yearsOfExperienceSchema.parse(yearsOfExperience)
      updateMutation.mutate({
        yearsOfExperience,
        competenceId: userCompetence.competence.competenceId,
      })
    } catch (error: unknown) {
      if (error instanceof ZodError)
        setLocalError(error.issues.at(0)?.message || 'Unknown error')
      else setLocalError('Unknown error')
    }
  }

  const handleDelete = () => {
    deleteMutation.mutate(userCompetence.competence.competenceId)
  }

  const deleteIsLoading =
    deleteMutation.isLoading &&
    deleteMutation.context === userCompetence.competence.competenceId

  const updateIsLoading =
    updateMutation.isLoading &&
    updateMutation.context === userCompetence.competence.competenceId

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell width={400} component="th" scope="row">
        {userCompetence.competence.name}
      </TableCell>
      <TableCell width={300}>
        <InputBase
          type="number"
          inputMode="numeric"
          value={yearsOfExperience}
          onChange={handleInput}
          onBlur={handleUpdate}
        />
        {(localError ||
          (updateMutation.isError && updateMutation.error instanceof Error)) && (
          <Typography variant="body2" color="error">
            {localError || updateMutation.error.message}
          </Typography>
        )}
        {updateIsLoading && <CircularProgress color="inherit" size={16} />}
      </TableCell>
      <TableCell padding="checkbox">
        <IconButton onClick={handleDelete}>
          {deleteIsLoading ? (
            <CircularProgress color="inherit" size={16} />
          ) : (
            <DeleteRounded />
          )}
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
