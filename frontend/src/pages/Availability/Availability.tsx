import { useQuery } from '@tanstack/react-query'
import React from 'react'

import api from '../../api/api'
import ErrorHandler from '../../components/ErrorHandler'
import FullPageLoader from '../../components/FullPageLoader'
import { useAuthedUser } from '../../components/WithAuth'
import AvailabilityProvider from './AvailabilityContext'
import AvailabilityPage from './AvailabilityPage'

/**
 * Presenter for availability
 */
export default function Availability() {
  const user = useAuthedUser()
  const { data, isLoading, isError, error } = useQuery(
    ['availability', user.personId],
    () => api.getAvailabilityForPerson(user.personId),
  )

  if (isError) return <ErrorHandler size="large" isError={true} error={error} />
  if (isLoading) return <FullPageLoader />

  return (
    <AvailabilityProvider availabilities={data}>
      <AvailabilityPage />
    </AvailabilityProvider>
  )
}
