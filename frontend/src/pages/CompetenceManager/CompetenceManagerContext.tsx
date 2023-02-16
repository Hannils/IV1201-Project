import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { createContext, PropsWithChildren, useContext, useState } from 'react'

import api from '../../api/api'
import { useAuthedUser } from '../../components/WithAuth'
import { Competence, CompetenceProfile, UserCompetence } from '../../util/Types'

interface UpdateParams {
  yearsOfExperience: number
  competenceId: number
}

interface CompetenceManagerData {
  competences: CompetenceProfile
  availableCompetences: Competence[]
  addMutation: UseMutationResult<
    AxiosResponse<unknown, unknown>,
    unknown,
    UserCompetence,
    unknown
  >
  deleteMutation: UseMutationResult<
    AxiosResponse<unknown, unknown>,
    unknown,
    number,
    unknown
  >
  updateMutation: UseMutationResult<
    AxiosResponse<unknown, unknown>,
    unknown,
    UpdateParams,
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
      onSuccess: (_, userCompetence) => {
        queryClient.removeQueries({ queryKey: ['competence_profile'] })
        console.log('userCompetence', userCompetence)
        setCompetences((c) => [userCompetence, ...c])
      },
      onError: (error) => console.error(error),
    }),
    deleteMutation: useMutation<
      AxiosResponse<unknown, unknown>,
      AxiosError,
      number,
      number
    >({
      mutationFn: (competenceId: number) =>
        api.deleteUserCompetence({ competenceId, personId: user.personId }),
      onMutate: (competenceId) => competenceId,
      onSuccess: (_, competenceId) => {
        queryClient.removeQueries({ queryKey: ['competence_profile'] })
        setCompetences((cs) =>
          cs.filter((c) => c.competence.competenceId !== competenceId),
        )
      },
      onError: (error) => console.error(error),
    }),
    updateMutation: useMutation<
      AxiosResponse<unknown, unknown>,
      AxiosError,
      UpdateParams,
      number
    >({
      mutationFn: async ({ yearsOfExperience, competenceId }: UpdateParams) =>
        api.updateUserCompetence({
          personId: user.personId,
          competenceId,
          yearsOfExperience,
        }),
      onMutate: ({ competenceId }) => competenceId,
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
