import React, { FormEvent, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import api from '../../api/api'
import useUser from '../../util/auth'
import { useForm } from 'react-hook-form'
import { SignupFields, SignupSchema } from './SignupTypes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Person } from '../../util/Types'
import { AxiosError } from 'axios'
import SignupPage from './SignupPage'

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
