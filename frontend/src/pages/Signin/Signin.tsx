import { Box, Button, Container, Link, Stack, TextField, Typography } from '@mui/material'
import React, { FormEvent, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import api from '../../api/api'
import useUser from '../../util/auth'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'



import { Person } from '../../util/Types'
import { AxiosError } from 'axios'
import SigninPage from './SigninPage'
import { SignInFields, SignInSchema } from './SigninTypes'

/**
 * Main component for signIn page
 */
export default function SignIn() {
  const navigate = useNavigate()
  const [, , setUser] = useUser()

  const form = useForm<SignInFields>({
    mode: 'onChange',
    resolver: zodResolver(SignInSchema),
  })

  const mutation = useMutation<Person, AxiosError, SignInFields>({
    mutationFn: (data: SignInFields) => api.signIn(data),
    onSuccess: (user) => {
      setUser(user)
      navigate('/')
    },
    onError: (error) => {
      if (error.response?.status === 404 && error.response.data === 'USER_NOT_FOUND') {
        form.setError('username', {
          message: 'User not found',
        })
      }
      if (error.response?.status === 400 && error.response.data === 'WRONG_PASSWORD') {
        form.setError('password', {
          message: 'Password is incorrect',
        })
      }
    },
  })


  return <SigninPage form={form} mutation={mutation} />
}
