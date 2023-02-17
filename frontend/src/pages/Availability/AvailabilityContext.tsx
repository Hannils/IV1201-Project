import { useQueryClient } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useContext } from 'react'
import {
  FormProvider,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
} from 'react-hook-form'

import { useAuthedUser } from '../../components/WithAuth'
import { Availability } from '../../util/Types'

export interface FormData {
  availabilities: Array<Partial<Availability>>
}

interface AvailabilityData {
  availabilities: UseFieldArrayReturn<FormData, 'availabilities', 'id'>
}

const availabilityContext = createContext<AvailabilityData>({} as AvailabilityData)

/**
 * Custom hook to get access data and CRUD for competence manager
 */
export const useAvailability = () => useContext(availabilityContext)

interface AvailabilityProviderProps {
  availabilities: Availability[]
}
export default function AvailabilityProvider({
  availabilities: initialAvailabilities,
  children,
}: PropsWithChildren<AvailabilityProviderProps>) {
  const user = useAuthedUser()
  const queryClient = useQueryClient()

  const methods = useForm<FormData>({
    defaultValues: {
      availabilities: initialAvailabilities,
    },
  })
  const availabilities = useFieldArray({
    control: methods.control,
    name: 'availabilities',
  })

  const contextData = {
    availabilities,
    /* addMutation: useMutation({
      mutationFn: (competence: UserCompetence) =>
        api.createUserCompetence(competence, user.personId),
      onSuccess: (_, userCompetence) => {
        queryClient.removeQueries({ queryKey: ['competence_profile'] })
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
    }), */
  } satisfies AvailabilityData

  return (
    <availabilityContext.Provider value={contextData}>
      <FormProvider {...methods}>{children}</FormProvider>
    </availabilityContext.Provider>
  )
}
