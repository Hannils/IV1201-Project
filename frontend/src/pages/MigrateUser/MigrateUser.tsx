import {
  Box,
  Button,
  Container,
  Stack,
  Stepper,
  TextField,
  Typography,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import GetTokenStep from './GetTokenStep'
import api from '../../api/api'
import ValidateTokenStep from './ValidateTokenStep'
import UpdateStep from './UpdateStep'

export default function MigrateUser() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [usedToken, setUsedToken] = useState<string | null>(null)

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
    onSuccess: () => {},
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
