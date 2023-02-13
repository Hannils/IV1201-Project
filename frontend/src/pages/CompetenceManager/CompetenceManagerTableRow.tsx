import { DeleteRounded } from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  InputBase,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { FieldArrayWithId, FieldPath, useFormContext } from 'react-hook-form'

import api from '../../api/api'
import { useAuthedUser } from '../../components/WithAuth'
import { validateWithZod, yearsOfExperienceSchema } from '../../util/schemas'
import { FormValues } from './CompetenceManagerTypes'
import { UserCompetence } from '../../util/Types'

export default function CompetenceManagerTableRow({
  index,
  field,
}: {
  index: number
  field: UserCompetence
}) {
  const inputName =
    `competenceProfile.${index}.yearsOfExperience` satisfies FieldPath<FormValues>

  const user = useAuthedUser()
  const queryClient = useQueryClient()

  const { register, getFieldState, watch, formState } = useFormContext<FormValues>()
  const validationState = getFieldState(inputName, formState)

  const deleteMutation = useMutation({
    mutationFn: (competenceId: number) =>
      api.deleteUserCompetence({ competenceId, personId: user.personId }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['competence_profile'] })
      onDelete()
    },
    onError: (error) => console.error(error),
  })

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (validationState.invalid) return
      return api.updateUserCompetence({
        competenceId: field.competence.competenceId,
        personId: user.personId,
        yearsOfExperience: watch(inputName),
      })
    },
    onSuccess: () => queryClient.removeQueries({ queryKey: ['competence_profile'] }),
    onError: (error) => console.error(error),
  })

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell width={400} component="th" scope="row">
        {field.competence.name}
      </TableCell>
      <TableCell width={300}>
        <InputBase
          {...register(inputName, {
            valueAsNumber: true,
            validate: (v) => validateWithZod(v, yearsOfExperienceSchema),
            onBlur: () => updateMutation.mutate(),
          })}
        />
        {validationState.error && (
          <Typography variant="body2" color="error">
            {validationState.error.message}
          </Typography>
        )}
        {updateMutation.isError && updateMutation.error instanceof Error && (
          <Typography variant="body2" color="error">
            {updateMutation.error.message}
          </Typography>
        )}
        {updateMutation.isLoading && <CircularProgress color="inherit" size={16} />}
      </TableCell>
      <TableCell padding="checkbox">
        <IconButton onClick={() => deleteMutation.mutate(field.competence.competenceId)}>
          {deleteMutation.isLoading ? (
            <CircularProgress color="inherit" size={16} />
          ) : (
            <DeleteRounded />
          )}
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
