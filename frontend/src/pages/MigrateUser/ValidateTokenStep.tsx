import { Box, Button, Stack, TextField } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React, { FormEvent } from 'react'

interface ValidateTokenSubmitEvent extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    token: HTMLInputElement
  }
}

export default function ValidateTokenStep({
  mutator,
}: {
  mutator: UseMutationResult<AxiosResponse<any, any>, unknown, string, unknown>
}) {
  const submit = (e: ValidateTokenSubmitEvent) => {
    e.preventDefault()
    mutator.mutate(e.target.token.value)
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack spacing={2}>
        <TextField
          disabled={mutator.isLoading}
          name="token"
          label="Enter the token"
          placeholder="xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          required
          variant="outlined"
        />
        <Button type="submit" variant="contained" disabled={mutator.isLoading}>
          {mutator.isLoading ? 'Validating...' : 'Continue'}
        </Button>
      </Stack>
    </Box>
  )
}
