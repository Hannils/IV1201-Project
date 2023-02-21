import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useContext } from 'react'

import api from '../../../api/api'
import { ApplicationPreview, ApplicationStatus } from '../../../util/Types'

interface UpdateParams {
  applicationId: number
  statusId: number
}

interface RecruiterHomeData {
  statuses: ApplicationStatus[]
  applications: ApplicationPreview[]
  updateMutation: UseMutationResult<unknown, unknown, UpdateParams>
}

const recruiterHomeContext = createContext<RecruiterHomeData>({} as RecruiterHomeData)

/**
 * Custom hook to get access data and Update for recruiter home
 */
export const useRecruiterHome = () => useContext(recruiterHomeContext)

interface RecruiterHomeProviderProps {
  statuses: ApplicationStatus[]
  applications: ApplicationPreview[]
  selectedOpportunity: number
}
export default function RecruiterHomeProvider({
  statuses,
  applications,
  selectedOpportunity,
  children,
}: PropsWithChildren<RecruiterHomeProviderProps>) {
  const queryClient = useQueryClient()

  const contextData = {
    statuses,
    applications,
    updateMutation: useMutation({
      mutationFn: (data: UpdateParams) => api.updateApplicationStatus(data),

      onMutate: ({ statusId }) =>
        statuses?.find((status) => status.statusId === statusId),

      onSuccess: (_, { applicationId }, status) => {
        if (!status) return
        queryClient.setQueryData<ApplicationPreview[]>(
          ['applicationsPreview', selectedOpportunity],
          (data) =>
            data?.map((row) =>
              row.applicationId === applicationId ? { ...row, status } : row,
            ),
        )
      },
    }),
  } satisfies RecruiterHomeData

  return (
    <recruiterHomeContext.Provider value={contextData}>
      {children}
    </recruiterHomeContext.Provider>
  )
}
