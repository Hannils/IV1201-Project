import { CircularProgress } from '@mui/material'

import CompetenceManagerPage from './CompetenceManagerPage'
import api from '../../../api/api'
import { useQuery } from '@tanstack/react-query'
import useUser from '../../../util/auth'

export default function CompetenceManager() {
  const [user] = useUser()
  const availableCompetencesQuery = useQuery(['competences'], () => api.getCompetences())
  const competenceProfileQuery = useQuery(['competence_profile', user?.personId], () =>
    user === null ? [] : api.getCompetenceProfile(user.personId),
  )

  if (availableCompetencesQuery.isLoading || competenceProfileQuery.isLoading) {
    return <CircularProgress />
  }

  if (!availableCompetencesQuery.isSuccess || !competenceProfileQuery.isSuccess) {
    return <p>Something bad happend</p>
  }

  console.log(availableCompetencesQuery.data, competenceProfileQuery.data)

  return (
    <CompetenceManagerPage
      availableCompetences={availableCompetencesQuery.data}
      competenceProfile={competenceProfileQuery.data}
    />
  )
}
