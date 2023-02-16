import { useQuery } from '@tanstack/react-query'

import api from '../../api/api'
import FullPageLoader from '../../components/FullPageLoader'
import { useAuthedUser } from '../../components/WithAuth'
import CompetenceManagerProvider from './CompetenceManagerContext'
import CompetenceManagerPage from './views/CompetenceManagerPage'

export default function CompetenceManager() {
  const user = useAuthedUser()
  const availableCompetencesQuery = useQuery(['competences'], () => api.getCompetences())
  const competenceProfileQuery = useQuery(['competence_profile', user.personId], () =>
    api.getCompetenceProfile(user.personId),
  )

  if (availableCompetencesQuery.isLoading || competenceProfileQuery.isLoading)
    return <FullPageLoader />

  if (!availableCompetencesQuery.isSuccess || !competenceProfileQuery.isSuccess)
    return <p>Something bad happend</p>

  return (
    <CompetenceManagerProvider
      availableCompetences={availableCompetencesQuery.data}
      competenceProfile={competenceProfileQuery.data}
    >
      <CompetenceManagerPage />
    </CompetenceManagerProvider>
  )
}
