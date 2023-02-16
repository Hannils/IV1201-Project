import { Alert, AlertProps, AlertTitle, Typography, TypographyProps } from '@mui/material'
import { isAxiosError } from 'axios'
import React, { ReactNode } from 'react'
import { ZodError } from 'zod'

interface LargeErrorHandlerProps extends AlertProps {
  size: 'large'
}

interface SmallErrorHandlerProps extends TypographyProps {
  size: 'small'
}

type ErrorHandlerProps = (LargeErrorHandlerProps | SmallErrorHandlerProps) & {
  isError: boolean
  error: unknown
}

export default function ErrorHandler(props: ErrorHandlerProps) {
  const { isError, error } = props
  if (!isError) return null

  const size = props.size || 'large'

  if (!(error instanceof Error))
    return (
      <ErrorRenderer
        size={size}
        heading="Unknown error"
        body="An unknown error happened. Please try again later"
      />
    )

  if (error instanceof ZodError)
    return (
      <ErrorRenderer
        size={size}
        heading="Validation error"
        body={error.issues.at(0)?.message}
      />
    )

  if (isAxiosError(error))
    return (
      <ErrorRenderer
        size={size}
        heading="There was an error with the request"
        body={'Further info: ' + error.message}
      />
    )

  return (
    <ErrorRenderer
      size={size}
      heading={error.name || 'Something went wrong'}
      body={error.message || 'No further details 😔'}
    />
  )
}

interface ErrorRendererProps {
  size: 'large' | 'small'
  heading?: string
  body: ReactNode
}

function ErrorRenderer(props: ErrorRendererProps) {
  if (props.size === 'small')
    return (
      <Typography color="error" variant="body2">
        {props.body}
      </Typography>
    )

  const { heading, body } = props
  return (
    <Alert severity="error">
      <AlertTitle>{heading}</AlertTitle>
      {body}
    </Alert>
  )
}
