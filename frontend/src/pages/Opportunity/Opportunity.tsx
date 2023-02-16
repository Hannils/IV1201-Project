import { Box, Button, Typography } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'

import api from '../../api/api'
import ErrorHandler from '../../components/ErrorHandler'
import FullPageLoader from '../../components/FullPageLoader'
import type { Opportunity } from '../../util/Types'

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

  if (isError) return <ErrorHandler size="large" isError={true} error={error} />
  if (isLoading || opportunity === undefined) return <FullPageLoader />

  return (
    <Box>
      <Button variant="contained">Apply for this opportunity</Button>
      <Typography variant="h1" mt="1em">
        {opportunity.name}
      </Typography>
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <Typography {...props} mt="1em" />,
          h3: ({ node, ...props }) => (
            <Typography {...props} mt="1em" gutterBottom variant="h3" />
          ),
          h4: ({ node, ...props }) => (
            <Typography {...props} mt="1em" gutterBottom variant="h4" />
          ),
        }}
      >
        {opportunity.description}
      </ReactMarkdown>
    </Box>
  )
}
