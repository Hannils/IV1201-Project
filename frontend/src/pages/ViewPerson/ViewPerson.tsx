import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'

import api from '../../api/api'
import ErrorHandler from '../../components/ErrorHandler'
import FullPageLoader from '../../components/FullPageLoader'
import { useAuthedUser } from '../../components/WithAuth'
import ViewPersonPage from './ViewPersonPage'

export default function ViewPerson() {
  const { personId: personIdAsString } = useParams()

  const personId = Number(personIdAsString)

  if (isNaN(personId)) return <p>404</p>

  // placeholder while we don't have endpoint
  const user = useAuthedUser()
  const competenceProfileQuery = useQuery(['competence_profile', personId], () =>
    api.getCompetenceProfile(personId),
  )
  const availabilityQuery = useQuery(['availability', user.personId], () =>
    api.getAvailabilityForPerson(personId),
  )

  if (competenceProfileQuery.isLoading || availabilityQuery.isLoading)
    return <FullPageLoader />

  if (competenceProfileQuery.isError || availabilityQuery.isError)
    return (
      <>
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
      person={user}
      competences={competenceProfileQuery.data}
      availability={availabilityQuery.data}
    />
  )
}
