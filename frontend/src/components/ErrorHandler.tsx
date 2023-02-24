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

/**
 * Component for handling errors
 * @param props object containing isError as `boolean` and error as `Error`
 */
export default function ErrorHandler(props: ErrorHandlerProps) {
  const { isError, error } = props
  if (!isError) return null

  if (!(error instanceof Error))
    return (
      <ErrorRenderer
        {...props}
        heading="Unknown error"
        body="An unknown error happened. Please try again later"
      />
    )

  if (error instanceof ZodError)
    return (
      <ErrorRenderer
        {...props}
        heading="Validation error"
        body={error.issues.at(0)?.message}
      />
    )

  if (isAxiosError(error))
    return (
      <ErrorRenderer
        {...props}
        heading="There was an error with the request"
        body={(props.size === 'large' ? 'Further info: ' : '') + error.message}
      />
    )

  return (
    <ErrorRenderer
      {...props}
      heading={error.name || 'Something went wrong'}
      body={error.message || 'No further details 😔'}
    />
  )
}

interface LargeErrorRendererProps extends AlertProps {
  size: 'large'
}

interface SmallErrorRendererProps extends TypographyProps {
  size: 'small'
}

type ErrorRendererProps = (LargeErrorRendererProps | SmallErrorRendererProps) & {
  body: ReactNode
  heading?: string
}

function ErrorRenderer(props: ErrorRendererProps) {
  const { size, body } = props
  if (size === 'small')
    return (
      <Typography {...props} color="error" variant="body2">
        {body}
      </Typography>
    )

  const { heading } = props
  return (
    <Alert {...props} severity="error">
      <AlertTitle>{heading}</AlertTitle>
      {body}
    </Alert>
  )
}
