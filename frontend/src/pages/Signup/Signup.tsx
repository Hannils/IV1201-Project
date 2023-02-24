import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import api from '../../api/api'
import useUser from '../../util/auth'
import { Person } from '../../util/Types'
import SignupPage from './SignupPage'
import { SignupFields, SignupSchema } from './SignupTypes'

/**
 * Main component for signUp page
 */
export default function Signup() {
  const navigate = useNavigate()
  const [, , setUser] = useUser()

  const form = useForm<SignupFields>({
    mode: 'onChange',
    resolver: zodResolver(SignupSchema),
  })

  const mutation = useMutation<Person, AxiosError, SignupFields>({
    mutationFn: (data) => api.signUp(data),
    onSuccess: (user) => {
      setUser(user)
      navigate('/')
    },
    onError: (error) => {
      if (
        error.response?.status === 400 &&
        error.response.data === 'USER_ALREADY_EXISTS'
      ) {
        form.setError('username', { message: 'Username is used by someone else' })
      }
      console.log(error)
    },
  })

  return <SignupPage {...{ form, mutation }} />
}
