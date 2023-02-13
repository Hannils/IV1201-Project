import { createContext, useContext, PropsWithChildren, useState } from 'react'
import api from '../../api/api'
import { useAuthedUser } from '../../components/WithAuth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Competence, CompetenceProfile, UserCompetence } from '../../util/Types'

const competenceManagerContext = createContext<Person>({} as Person)

/**
 * Custom hook to get access data and CRUD for competence manager
 */
export const useCompetenceManager = () => useContext(competenceManagerContext)

interface CompetenceManagerProviderProps {
  availableCompetences: Competence[]
  competenceProfile: CompetenceProfile
}
export default function CompetenceManagerProvider({
  availableCompetences,
  competenceProfile,
  children,
}: PropsWithChildren<CompetenceManagerProviderProps>) {
  const user = useAuthedUser()
  const queryClient = useQueryClient()
  const [competences, setCompetences] =
    useState<CompetenceProfile>(competenceProfile)

  const contextData = {
    competences,
    availableCompetences,
    addMutation: useMutation({
      mutationFn: (competence: UserCompetence) =>
        api.createUserCompetence(competence, user.personId),
      /* onMutate: () => setCreateAnchor(null),
      onSuccess: (_, userCompetence) => {
        queryClient.removeQueries({ queryKey: ['competence_profile'] })
        competences.prepend(userCompetence)
      }, */
      onError: (error) => console.error(error),
    }),
  }
  return (
    <competenceManagerContext.Provider value={contextData}>
      {children}
    </competenceManagerContext.Provider>
  )
}
