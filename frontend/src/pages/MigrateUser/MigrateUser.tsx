import {
  Container,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../api/api'
import useUser from '../../util/auth'
import GetTokenStep from './GetTokenStep'
import UpdateStep from './UpdateStep'
import ValidateTokenStep from './ValidateTokenStep'

export default function MigrateUser() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [usedToken, setUsedToken] = useState<string | null>(null)
  const [, , setUser] = useUser()
  const navigate = useNavigate()

  const getTokenMutation = useMutation({
    mutationFn: (email: string) => api.getMigrationToken({ email }),
    onSuccess: () => setCurrentStep(1),
  })

  const validateTokenMutation = useMutation({
    mutationFn: (token: string) => api.validateMigrationToken({ token }),
    onSuccess: (_, token) => {
      setUsedToken(token)
      setCurrentStep(2)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { username: string; password: string; token: string }) =>
      api.migrateUser(data),
    onSuccess: (user) => {
      setUser(user)
      navigate('/')
    },
  })

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
            <GetTokenStep mutator={getTokenMutation} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Validate token</StepLabel>
          <StepContent>
            <ValidateTokenStep mutator={validateTokenMutation} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>Enter new username and password</StepLabel>
          <StepContent>
            {usedToken === null ? (
              'An unexptected error happend...'
            ) : (
              <UpdateStep mutator={updateMutation} token={usedToken} />
            )}
          </StepContent>
        </Step>
      </Stepper>
    </Container>
  )
}
