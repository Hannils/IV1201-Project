import { Box, Button, Stack, TextField } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React, { FormEvent } from 'react'
import { AuthResponse } from '../../api/api'

interface UpdateSubmitEvent extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    token: HTMLInputElement
    username: HTMLInputElement
    password: HTMLInputElement
  }
}

export default function UpdateStep({
  mutator,
  token,
}: {
  mutator: UseMutationResult<
    AxiosResponse<AuthResponse, any>,
    unknown,
    {
      username: string
      password: string
      token: string
    },
    unknown
  >
  token: string
}) {
  const submit = (e: UpdateSubmitEvent) => {
    e.preventDefault()
    mutator.mutate({
      token: e.target.token.value,
      username: e.target.username.value,
      password: e.target.password.value,
    })
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack spacing={2}>
        <TextField
          disabled={true}
          value={token}
          name="token"
          label="Token"
          required
          variant="outlined"
        />
        <TextField
          disabled={mutator.isLoading}
          name="username"
          label="New username"
          required
          variant="outlined"
        />
        <TextField
          disabled={mutator.isLoading}
          name="password"
          type="password"
          label="New password"
          required
          variant="outlined"
        />
        <Button type="submit" variant="contained" disabled={mutator.isLoading}>
          {mutator.isLoading ? 'Updating...' : 'Update account information'}
        </Button>
      </Stack>
    </Box>
  )
}
