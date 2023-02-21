import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'

import api from '../../api/api'
import ErrorHandler from '../../components/ErrorHandler'
import { Opportunity } from '../../util/Types'

interface OpportunityPageProps {
  opportunity: Opportunity
  initialHasApplied: boolean
}

export default function OpportunityPage({
  opportunity,
  initialHasApplied,
}: OpportunityPageProps) {
  const { id: stringId } = useParams()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [hasApplied, setHasApplied] = useState(initialHasApplied)
  const setModal = (state: boolean) => () => setShowModal(state)

  const applyMutation = useMutation({
    mutationFn: () => api.createApplication(opportunity.opportunityId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['application', Number(stringId)] })
      setHasApplied(true)
    },
    onSettled: () => setShowModal(false),
  })

  return (
    <Stack spacing={4}>
      <Typography variant="h1">{opportunity.name}</Typography>
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          p: ({ node, ...props }) => <Typography {...props} mt="1em" />,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          h3: ({ node, ...props }) => (
            <Typography {...props} mt="1em" gutterBottom variant="h3" />
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          h4: ({ node, ...props }) => (
            <Typography {...props} mt="1em" gutterBottom variant="h4" />
          ),
        }}
      >
        {opportunity.description}
      </ReactMarkdown>
      <Box>
        {hasApplied ? (
          <Button variant="contained" disabled>
            You have applied for this position
          </Button>
        ) : (
          <Button variant="contained" onClick={setModal(true)}>
            Apply for this opportunity...
          </Button>
        )}
      </Box>
      <ErrorHandler
        size="large"
        isError={applyMutation.isError}
        error={applyMutation.error}
      />
      <Dialog
        open={showModal}
        onClose={setModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {applyMutation.isLoading && <LinearProgress />}
        <DialogTitle id="alert-dialog-title">Are you sure you want to apply?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            When you have applied the hiring managers will ... Lorem ipsum dolor sit amet
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={setModal(false)}>Cancel</Button>
          <Button onClick={() => applyMutation.mutate()} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
