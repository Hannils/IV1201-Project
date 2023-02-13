import { createContext, useContext, PropsWithChildren, useState } from 'react'
import api from '../../api/api'
import { useAuthedUser } from '../../components/WithAuth'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { Competence, CompetenceProfile, UserCompetence } from '../../util/Types'
import { AxiosResponse } from 'axios'

interface CompetenceManagerData {
  competences: CompetenceProfile
  availableCompetences: Competence[]
  addMutation: UseMutationResult<any, unknown, UserCompetence, unknown>
  deleteMutation: UseMutationResult<any, unknown, number, unknown>
  updateMutation: UseMutationResult<
    any,
    unknown,
    {
      yearsOfExperience: number
      competenceId: number
    },
    unknown
  >
}

const competenceManagerContext = createContext<CompetenceManagerData>(
  {} as CompetenceManagerData,
)

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
  const [competences, setCompetences] = useState<CompetenceProfile>(competenceProfile)

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
    deleteMutation: useMutation({
      mutationFn: (competenceId: number) =>
        api.deleteUserCompetence({ competenceId, personId: user.personId }),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['competence_profile'] })
      },
      onError: (error) => console.error(error),
    }),
    updateMutation: useMutation({
      mutationFn: async ({
        yearsOfExperience,
        competenceId,
      }: {
        yearsOfExperience: number
        competenceId: number
      }) =>
        api.updateUserCompetence({
          personId: user.personId,
          competenceId,
          yearsOfExperience,
        }),
      onSuccess: () => queryClient.removeQueries({ queryKey: ['competence_profile'] }),
      onError: (error) => console.error(error),
    }),
  } satisfies CompetenceManagerData
  return (
    <competenceManagerContext.Provider value={contextData}>
      {children}
    </competenceManagerContext.Provider>
  )
}
