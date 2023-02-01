import {
  Box,
  Button,
  Container,
  FormGroup,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { FormEvent, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import api from '../../api/api'
import useUser from '../../util/auth'

interface SignInFormElement extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    username: HTMLInputElement
    password: HTMLInputElement
  }
}

export default function SignIn() {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [, , setUser] = useUser()

  const signIn = (e: SignInFormElement) => {
    const username = e.target.username.value
    const password = e.target.password.value
    e.preventDefault()
    setLoading(true)
    api
      .signIn({ username, password })
      .then((user) => setUser(user))
      .then(() => navigate('/'))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'grid', alignContent: 'center', minHeight: '80vh' }}
    >
      <Typography variant="h1" gutterBottom>
        Sign in
      </Typography>
      <Box component="form" onSubmit={signIn}>
        <Stack spacing={2}>
          <TextField
            disabled={loading}
            name="username"
            label="Username"
            required
            variant="outlined"
          />
          <TextField
            disabled={loading}
            name="password"
            label="Password"
            required
            variant="outlined"
            type="password"
          />
          <Button disabled={loading} type="submit" variant="contained">
            {loading ? 'Signing in...' : 'Sign in'}
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
