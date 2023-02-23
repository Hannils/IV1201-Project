import { Box, Button, Stack, TextField } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React, { FormEvent } from 'react'
import { GetTokenFields } from '../migrateUserTypes'
import { UseFormReturn } from 'react-hook-form'
import useErrorMessage from '../../../util/useErrorMessages'

interface GetTokenStepProps {
  mutator: UseMutationResult<unknown, unknown, GetTokenFields, unknown>
  form: UseFormReturn<GetTokenFields>
}
/**
 * Component for getting token in migrating user
 */
export default function GetTokenStep({ mutator, form }: GetTokenStepProps) {
  const { handleSubmit, register, formState } = form

  const emailError = useErrorMessage<GetTokenFields>(formState, 'email')

  return (
    <Box component="form" onSubmit={handleSubmit((data) => mutator.mutate(data))}>
      <Stack spacing={2}>
        <TextField
          {...register('email')}
          disabled={mutator.isLoading}
          label="Email"
          type="email"
          required
          error={!!emailError}
          helperText={emailError}
          variant="outlined"
        />
        <Button type="submit" variant="contained" disabled={mutator.isLoading}>
          {mutator.isLoading ? 'Generating...' : 'Get recovery code'}
        </Button>
      </Stack>
    </Box>
  )
}
