import { Box, Button, Stack, TextField } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React, { FormEvent } from 'react'
import { ValidateTokenFields } from '../migrateUserTypes'
import { UseFormReturn, useFormState } from 'react-hook-form'
import useErrorMessage from '../../../util/useErrorMessages'
import ErrorHandler from '../../../components/ErrorHandler'
import { useFormDirtySinceLastSubmit } from '../../../util/useDirtySinceLastSubmit'

interface ValidateTokenStepProps {
  mutator: UseMutationResult<unknown, unknown, ValidateTokenFields>
  form: UseFormReturn<ValidateTokenFields>
  goBack: Function
}

/**
 * Component for validating token in migrating user
 */
export default function ValidateTokenStep({
  mutator,
  form,
  goBack,
}: ValidateTokenStepProps) {
  const { handleSubmit, register, formState, control } = form
  const { isValid, submitCount } = useFormState({ control })

  const tokenError = useErrorMessage<ValidateTokenFields>(formState, 'token')
  const dirtySinceLastSubmit = useFormDirtySinceLastSubmit<ValidateTokenFields>(form)

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
          disabled={mutator.isLoading}
          name="token"
          label="Enter the token"
          placeholder="xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          required
          variant="outlined"
          autoComplete="off"
          error={!!tokenError}
          helperText={tokenError}
        />
        <Stack direction="row" spacing={4}>
          {tokenError && (
            <Button variant="outlined" fullWidth onClick={() => goBack()}>
              Go back
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={mutator.isLoading || (submitCount !== 0 && !isValid)}
            fullWidth
          >
            {mutator.isLoading ? 'Validating...' : 'Continue'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
