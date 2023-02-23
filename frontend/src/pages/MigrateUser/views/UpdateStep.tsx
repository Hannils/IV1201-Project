import { Box, Button, Stack, TextField } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import React, { FormEvent } from 'react'

import { Person } from '../../../util/Types'
import { UpdateFields } from '../migrateUserTypes'
import { UseFormReturn } from 'react-hook-form'
import useErrorMessage from '../../../util/useErrorMessages'

interface UpdateStepProps {
  mutator: UseMutationResult<Person, unknown, UpdateFields, unknown>
  form: UseFormReturn<UpdateFields>
}

export default function UpdateStep({ mutator, form }: UpdateStepProps) {
  const { handleSubmit, register, formState } = form

  const usernameError = useErrorMessage<UpdateFields>(formState, 'username')
  const passwordError = useErrorMessage<UpdateFields>(formState, 'password')

  return (
    <Box component="form" onSubmit={handleSubmit((data) => mutator.mutate(data))}>
      <Stack spacing={2}>
        <TextField
          {...register('token')}
          disabled={true}
          label="Token"
          required
          variant="outlined"
        />
        <TextField
          {...register('username')}
          disabled={mutator.isLoading}
          label="New username"
          required
          variant="outlined"
          error={!!usernameError}
          helperText={usernameError}
        />
        <TextField
          {...register('password')}
          disabled={mutator.isLoading}
          type="password"
          label="New password"
          required
          variant="outlined"
          error={!!passwordError}
          helperText={passwordError}
        />
        <Button type="submit" variant="contained" disabled={mutator.isLoading}>
          {mutator.isLoading ? 'Updating...' : 'Finish'}
        </Button>
      </Stack>
    </Box>
  )
}
