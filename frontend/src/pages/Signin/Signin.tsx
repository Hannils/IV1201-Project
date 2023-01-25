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
  import { signInWithEmailAndPassword } from 'firebase/auth'
  import React, { FormEvent, useState } from 'react'
  import { Link as RouterLink, useNavigate } from 'react-router-dom'
  
  import { auth } from '../../api/firebase'
  
  interface SignInFormElement extends FormEvent<HTMLFormElement> {
    target: EventTarget & {
      email: HTMLInputElement
      password: HTMLInputElement
    }
  }
  
  export default function SignIn() {
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
  
    const signIn = (e: SignInFormElement) => {
      e.preventDefault()
      setLoading(true)
      signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
        .then(() => navigate('/'))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false))
    }
  
    return (
      <Container maxWidth="sm">
        <Typography variant="h1" textAlign="center" gutterBottom>
          Sign in
        </Typography>
        <Box component="form" onSubmit={signIn}>
          <Stack spacing={2}>
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
            <Button disabled={loading} type="submit" variant="contained">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            <Typography>
              No account?{' '}
              <Link component={RouterLink} to="/signup">
                Create account
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Container>
    )
  }