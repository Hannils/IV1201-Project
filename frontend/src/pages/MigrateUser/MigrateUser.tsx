import {
  Container,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../api/api'
import useUser from '../../util/auth'
import GetTokenStep from './views/GetTokenStep'
import UpdateStep from './views/UpdateStep'
import ValidateTokenStep from './views/ValidateTokenStep'
import {
  GetTokenFields,
  UpdateFields,
  ValidateTokenFields,
  getTokenSchema,
  updateSchema,
  validateTokenSchema,
} from './migrateUserTypes'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Person } from '../../util/Types'
import ErrorHandler from '../../components/ErrorHandler'

/**
 * Presenter for migrate user
 */
export default function MigrateUser() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [, , setUser] = useUser()
  const navigate = useNavigate()

  const getTokenForm = useForm<GetTokenFields>({
    mode: 'onChange',
    resolver: zodResolver(getTokenSchema),
    shouldUseNativeValidation: false,
  })

  const validateTokenForm = useForm<ValidateTokenFields>({
    mode: 'onChange',
    resolver: zodResolver(validateTokenSchema),
    shouldUseNativeValidation: false,
  })

  const updateForm = useForm<UpdateFields>({
    mode: 'onChange',
    resolver: zodResolver(updateSchema),
    shouldUseNativeValidation: false,
  })

  const getTokenMutation = useMutation<unknown, AxiosError, GetTokenFields>({
    mutationFn: ({ email }) => api.getMigrationToken(email),
    onSuccess: () => setCurrentStep(1),
    onError: (res) =>
      res.response?.status === 404 &&
      res.response.data === 'USER_NOT_FOUND' &&
      getTokenForm.setError('email', {
        message: 'No recoverable user found with that email address.',
      }),
  })

  const validateTokenMutation = useMutation<unknown, AxiosError, ValidateTokenFields>({
    mutationFn: ({ token }) => api.validateMigrationToken(token),
    onSuccess: (_, { token }) => {
      updateForm.setValue('token', token)
      setCurrentStep(2)
    },
    onError: ({ response }) =>
      response?.status === 404 &&
      response.data === 'BAD_TOKEN' &&
      validateTokenForm.setError('token', { message: 'Token is invalid or has expired' }),
  })

  const updateMutation = useMutation<Person, AxiosError, UpdateFields>({
    mutationFn: (data) => api.migrateUser(data),
    onSuccess: (user) => {
      setUser(user)
      navigate('/')
    },
    onError: ({ response }) =>
      response?.status === 400 &&
      response.data === 'USER_ALREADY_EXISTS' &&
      updateForm.setError('username', { message: 'Username is used by someone else' }),
  })

  const handleGoBack = useCallback(() => {
    validateTokenForm.reset()
    setCurrentStep(0)
  }, [setCurrentStep, validateTokenForm.reset])

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'grid', alignContent: 'center', minHeight: '80vh' }}
    >
      <Typography variant="h1" gutterBottom>
        Add username and passsword for account
      </Typography>
      <Stepper activeStep={currentStep} orientation="vertical">
        <Step>
          <StepLabel>Get token</StepLabel>
          <StepContent>
            <GetTokenStep form={getTokenForm} mutator={getTokenMutation} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Validate token</StepLabel>
          <StepContent>
            <ValidateTokenStep
              goBack={handleGoBack}
              form={validateTokenForm}
              mutator={validateTokenMutation}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Enter new username and password</StepLabel>
          <StepContent>
            <UpdateStep form={updateForm} mutator={updateMutation} />
          </StepContent>
        </Step>
      </Stepper>
    </Container>
  )
}
