import { Box, Button, Stack, TextField } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React, { FormEvent } from 'react'
import { GetTokenFields } from '../migrateUserTypes'
import { UseFormReturn, useFormState } from 'react-hook-form'
import useErrorMessage from '../../../util/useErrorMessages'
import ErrorHandler from '../../../components/ErrorHandler'
import { useFormDirtySinceLastSubmit } from '../../../util/useDirtySinceLastSubmit'

interface GetTokenStepProps {
  mutator: UseMutationResult<unknown, unknown, GetTokenFields, unknown>
  form: UseFormReturn<GetTokenFields>
}
/**
 * Component for getting token in migrating user
 */
export default function GetTokenStep({ mutator, form }: GetTokenStepProps) {
  const { handleSubmit, register, formState, control } = form
  const { isValid, submitCount } = useFormState({ control })

  const emailError = useErrorMessage<GetTokenFields>(formState, 'email')
  const dirtySinceLastSubmit = useFormDirtySinceLastSubmit<GetTokenFields>(form)

  return (
    <Box component="form" onSubmit={handleSubmit((data) => mutator.mutate(data))}>
      <Stack spacing={2}>
        <ErrorHandler
          size="large"
          error={mutator.error}
          isError={mutator.isError && !dirtySinceLastSubmit && isValid}
        />
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
        <Button
          type="submit"
          variant="contained"
          disabled={mutator.isLoading || (submitCount !== 0 && !isValid)}
        >
          {mutator.isLoading ? 'Generating...' : 'Get recovery code'}
        </Button>
      </Stack>
    </Box>
  )
}
