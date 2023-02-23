import { Box, Button, Container, Link, Stack, TextField, Typography } from '@mui/material'
import React, { FormEvent, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import useErrorMessage from '../../util/useErrorMessages'
import { UseMutationResult } from '@tanstack/react-query'
import { UseFormReturn } from 'react-hook-form'
import { Person } from '../../util/Types'
import { AxiosError } from 'axios'
import { SignInFields } from './SigninTypes'

interface SigninPageProps {
  mutation: UseMutationResult<Person, AxiosError, SignInFields>
  form: UseFormReturn<SignInFields>
}

export default function SigninPage({ form, mutation }: SigninPageProps) {
  const { formState, register, handleSubmit } = form
  const usernameError = useErrorMessage<SignInFields>(formState, 'username')
  const passwordError = useErrorMessage<SignInFields>(formState, 'password')

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'grid', alignContent: 'center', minHeight: '80vh' }}
    >
      <Typography variant="h1" gutterBottom>
        Sign in
      </Typography>
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
          <Button disabled={mutation.isLoading} type="submit" variant="contained">
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
