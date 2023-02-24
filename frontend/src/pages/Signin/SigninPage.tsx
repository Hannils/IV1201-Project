import { Box, Button, Container, Link, Stack, TextField, Typography } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React from 'react'
import { UseFormReturn, useFormState } from 'react-hook-form'
import { Link as RouterLink } from 'react-router-dom'

import ErrorHandler from '../../components/ErrorHandler'
import { Person } from '../../util/Types'
import { useFormDirtySinceLastSubmit } from '../../util/useDirtySinceLastSubmit'
import useErrorMessage from '../../util/useErrorMessages'
import { SignInFields } from './SigninTypes'

interface SigninPageProps {
  mutation: UseMutationResult<Person, AxiosError, SignInFields>
  form: UseFormReturn<SignInFields>
}

/**
 * View for signInPage
 */
export default function SigninPage({ form, mutation }: SigninPageProps) {
  const { formState, register, handleSubmit, control } = form
  const { isValid, submitCount } = useFormState({ control })
  const usernameError = useErrorMessage<SignInFields>(formState, 'username')
  const passwordError = useErrorMessage<SignInFields>(formState, 'password')

  const dirtySinceLastSubmit = useFormDirtySinceLastSubmit<SignInFields>(form)

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'grid', alignContent: 'center', minHeight: '80vh' }}
    >
      <Typography variant="h1" gutterBottom>
        Sign in
      </Typography>
      <ErrorHandler
        sx={{ mb: 5 }}
        size="large"
        error={mutation.error}
        isError={mutation.isError && !dirtySinceLastSubmit && isValid}
      />
      <Box component="form" onSubmit={handleSubmit((params) => mutation.mutate(params))}>
        <Stack spacing={2}>
          <TextField
            {...register('username')}
            disabled={mutation.isLoading}
            label="Username"
            required
            variant="outlined"
            error={!!usernameError}
            helperText={usernameError}
          />
          <TextField
            disabled={mutation.isLoading}
            {...register('password')}
            label="Password"
            required
            variant="outlined"
            type="password"
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            disabled={mutation.isLoading || (submitCount !== 0 && !isValid)}
            type="submit"
            variant="contained"
          >
            {mutation.isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          <Typography>
            No account?{' '}
            <Link component={RouterLink} to="/signup">
              Create account
            </Link>
          </Typography>
          <Typography>
            No username or password?{' '}
            <Link component={RouterLink} to="/migrate-user">
              Add login for account
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Container>
  )
}
