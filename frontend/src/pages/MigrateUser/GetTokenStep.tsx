import { Box, Button, Stack, TextField } from '@mui/material'
import { UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React, { FormEvent } from 'react'

interface GetTokenSubmitEvent extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    email: HTMLInputElement
  }
}

export default function GetTokenStep({
  mutator,
}: {
  mutator: UseMutationResult<AxiosResponse<unknown, unknown>, unknown, string, unknown>
}) {
  const submit = (e: GetTokenSubmitEvent) => {
    e.preventDefault()
    mutator.mutate(e.target.email.value)
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack spacing={2}>
        <TextField
          disabled={mutator.isLoading}
          name="email"
          label="Email"
          type="email"
          required
          variant="outlined"
        />
        <Button type="submit" variant="contained" disabled={mutator.isLoading}>
          {mutator.isLoading ? 'Generating...' : 'Get recovery code'}
        </Button>
      </Stack>
    </Box>
  )
}
