import { Box, Button, Stack, TextField } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import React from 'react'
import { UseFormReturn, useFormState } from 'react-hook-form'

import ErrorHandler from '../../../components/ErrorHandler'
import { Person } from '../../../util/Types'
import { useFormDirtySinceLastSubmit } from '../../../util/useDirtySinceLastSubmit'
import useErrorMessage from '../../../util/useErrorMessages'
import { UpdateFields } from '../migrateUserTypes'

interface UpdateStepProps {
  mutator: UseMutationResult<Person, unknown, UpdateFields, unknown>
  form: UseFormReturn<UpdateFields>
}

/**
 * Component for updating username and password in migrating user
 */
export default function UpdateStep({ mutator, form }: UpdateStepProps) {
  const { handleSubmit, register, formState, control } = form
  const { isValid, submitCount } = useFormState({ control })

  const usernameError = useErrorMessage<UpdateFields>(formState, 'username')
  const passwordError = useErrorMessage<UpdateFields>(formState, 'password')
  const dirtySinceLastSubmit = useFormDirtySinceLastSubmit<UpdateFields>(form)

  return (
    <Box component="form" onSubmit={handleSubmit((data) => mutator.mutate(data))}>
      <Stack spacing={2}>
        <ErrorHandler
          size="large"
          error={mutator.error}
          isError={mutator.isError && !dirtySinceLastSubmit && isValid}
        />
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
        <Button
          type="submit"
          variant="contained"
          disabled={mutator.isLoading || (submitCount !== 0 && !isValid)}
        >
          {mutator.isLoading ? 'Updating...' : 'Finish'}
        </Button>
      </Stack>
    </Box>
  )
}
