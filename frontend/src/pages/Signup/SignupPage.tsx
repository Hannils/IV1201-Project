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
import { SignupFields } from './SignupTypes'

interface SignupPageProps {
  form: UseFormReturn<SignupFields>
  mutation: UseMutationResult<Person, AxiosError, SignupFields>
}
/**
 * View for signUp page
 */
export default function SignupPage({ form, mutation }: SignupPageProps) {
  const { handleSubmit, register, formState, control } = form
  const { isLoading, mutate } = mutation
  const { isValid, submitCount } = useFormState({ control })

  const firstnameError = useErrorMessage<SignupFields>(formState, 'firstname')
  const lastnameError = useErrorMessage<SignupFields>(formState, 'lastname')
  const personNumberError = useErrorMessage<SignupFields>(formState, 'personNumber')
  const usernameError = useErrorMessage<SignupFields>(formState, 'username')
  const emailError = useErrorMessage<SignupFields>(formState, 'email')
  const passwordError = useErrorMessage<SignupFields>(formState, 'password')

  const dirtySinceLastSubmit = useFormDirtySinceLastSubmit<SignupFields>(form)

  console.log(mutation.isError, !dirtySinceLastSubmit, isValid)

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'grid', alignContent: 'center', minHeight: '80vh' }}
    >
      <Typography variant="h1" mb={3}>
        Sign up
      </Typography>
      <ErrorHandler
        sx={{ mb: 5 }}
        size="large"
        error={mutation.error}
        isError={mutation.isError && !dirtySinceLastSubmit && isValid}
      />
      <Box component="form" onSubmit={handleSubmit((data) => mutate(data))}>
        <Stack spacing={2}>
          <TextField
            {...register('firstname')}
            disabled={isLoading}
            error={!!firstnameError}
            helperText={firstnameError}
            label="First name"
            required
            variant="outlined"
          />
          <TextField
            {...register('lastname')}
            disabled={isLoading}
            error={!!lastnameError}
            helperText={lastnameError}
            label="Last name"
            required
            variant="outlined"
          />
          <TextField
            {...register('personNumber')}
            disabled={isLoading}
            error={!!personNumberError}
            helperText={personNumberError}
            label="person nummer"
            placeholder={'YYYYMMDD-XXXX'}
            required
            variant="outlined"
          />
          <TextField
            {...register('username')}
            disabled={isLoading}
            error={!!usernameError}
            helperText={usernameError}
            label="Username"
            required
            variant="outlined"
          />
          <TextField
            {...register('email')}
            disabled={isLoading}
            error={!!emailError}
            helperText={emailError}
            label="Email"
            required
            type="email"
            variant="outlined"
          />
          <TextField
            {...register('password')}
            disabled={isLoading}
            error={!!passwordError}
            helperText={passwordError}
            label="Password"
            required
            variant="outlined"
            type="password"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || (submitCount !== 0 && !isValid)}
          >
            {isLoading ? 'Creating account... ' : 'Sign up'}
          </Button>
          <Typography>
            Aleady have an account?{' '}
            <Link component={RouterLink} to="/signin">
              Sign in
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
