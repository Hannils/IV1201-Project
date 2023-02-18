import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'

import api from '../../api/api'
import ErrorHandler from '../../components/ErrorHandler'
import FullPageLoader from '../../components/FullPageLoader'
import type { Opportunity } from '../../util/Types'
import OpportunityPage from './OpportunityPage'

export default function Opportunity() {
  const { id: stringId } = useParams()
  const queryClient = useQueryClient()

  const id = Number(stringId)
  if (isNaN(id)) return <p>404</p>

  const {
    data: opportunity,
    isLoading,
    isError,
    error,
  } = useQuery(['opportunity', id], () => api.getOpportunity(id), {
    initialData: () =>
      queryClient
        .getQueryData<Opportunity[]>(['opportunity'])
        ?.find((d) => d.opportunityId === id),
  })
  const applicationQuery = useQuery(['application', id], () => api.getApplication(id))

  if (isError) return <ErrorHandler size="large" isError={true} error={error} />
  if (applicationQuery.isError)
    return <ErrorHandler size="large" isError={true} error={applicationQuery.error} />
  if (applicationQuery.isLoading || isLoading || opportunity === undefined)
    return <FullPageLoader />

  return <OpportunityPage opportunity={opportunity} initialHasApplied={applicationQuery.data !== null} />
}
