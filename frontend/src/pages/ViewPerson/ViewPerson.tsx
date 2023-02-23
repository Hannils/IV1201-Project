import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'

import api from '../../api/api'
import ErrorHandler from '../../components/ErrorHandler'
import FullPageLoader from '../../components/FullPageLoader'
import { useAuthedUser } from '../../components/WithAuth'
import ViewPersonPage from './ViewPersonPage'

/**
 * Main component for viewPerson
 */
export default function ViewPerson() {
  const { personId: personIdAsString } = useParams()

  const personId = Number(personIdAsString)

  if (isNaN(personId)) return <p>404</p>

  const personQuery = useQuery(['person', personId], () =>
    api.getUserWithPersonId(personId),
  )
  const competenceProfileQuery = useQuery(['competence_profile', personId], () =>
    api.getCompetenceProfile(personId),
  )
  const availabilityQuery = useQuery(['availability', personId], () =>
    api.getAvailabilityForPerson(personId),
  )

  if (
    competenceProfileQuery.isLoading ||
    availabilityQuery.isLoading ||
    personQuery.isLoading
  )
    return <FullPageLoader />

  if (competenceProfileQuery.isError || availabilityQuery.isError || personQuery.isError)
    return (
      <>
        <ErrorHandler
          size="large"
          isError={personQuery.isError}
          error={personQuery.error}
        />
        <ErrorHandler
          size="large"
          isError={competenceProfileQuery.isError}
          error={competenceProfileQuery.error}
        />
        <ErrorHandler
          size="large"
          isError={availabilityQuery.isError}
          error={availabilityQuery.error}
        />
      </>
    )

  return (
    <ViewPersonPage
      person={personQuery.data}
      competences={competenceProfileQuery.data}
      availability={availabilityQuery.data}
    />
  )
}
