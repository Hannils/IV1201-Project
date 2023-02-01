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
import { signInWithCustomToken } from 'firebase/auth'
import React, { FormEvent, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import api from '../../api/api'

import useUser from '../../util/auth'

interface SignUpFormElement extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    firstname: HTMLInputElement
    lastname: HTMLInputElement
    username: HTMLInputElement
    email: HTMLInputElement
    password: HTMLInputElement
    personNumber: HTMLInputElement
  }
}

export default function Signup() {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [, , setUser] = useUser()

  const signUp = (e: SignUpFormElement) => {
    e.preventDefault()
    setLoading(true)
    const firstname = e.target.firstname.value
    const lastname = e.target.lastname.value
    const email = e.target.email.value
    const username = e.target.username.value
    const password = e.target.password.value
    const personNumber = e.target.personNumber.value

    api
      .signUp({ firstname, lastname, email, username, password, personNumber })
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
        Sign up
      </Typography>
      <Box component="form" onSubmit={signUp}>
        <Stack spacing={2}>
          <TextField
            disabled={loading}
            name="firstname"
            label="First name"
            required
            variant="outlined"
          />
          <TextField
            disabled={loading}
            name="lastname"
            label="Last name"
            required
            variant="outlined"
          />
          <TextField
            disabled={loading}
            name="personNumber"
            label="person nummer"
            required
            variant="outlined"
          />
          <TextField name="username" label="Username" required variant="outlined" />
          <TextField
            disabled={loading}
            name="email"
            label="Email"
            required
            type="email"
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
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating account... ' : 'Sign up'}
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
