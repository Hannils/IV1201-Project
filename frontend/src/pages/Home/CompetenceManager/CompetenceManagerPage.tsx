import { AddRounded } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import api from '../../../api/api'
import { useAuthedUser } from '../../../components/WithAuth'
import { Competence, CompetenceProfile, UserCompetence } from '../../../util/Types'
import CompetenceManagerTableRow from './CompetenceManagerTableRow'
import { FormValues } from './CompetenceManagerTypes'

export default function CompetenceManagerPage({
  availableCompetences,
  competenceProfile,
}: {
  availableCompetences: Competence[]
  competenceProfile: CompetenceProfile
}) {
  const user = useAuthedUser()
  const queryClient = useQueryClient()
  const methods = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { competenceProfile },
  })
  const competences = useFieldArray({
    control: methods.control,
    name: 'competenceProfile',
  })

  const [createAnchor, setCreateAnchor] = useState<HTMLButtonElement | null>(null)

  const addMutation = useMutation({
    mutationFn: (competence: UserCompetence) =>
      api.createUserCompetence(competence, user.personId),
    onMutate: () => setCreateAnchor(null),
    onSuccess: (_, userCompetence) => {
      queryClient.removeQueries({ queryKey: ['competence_profile'] })
      competences.prepend(userCompetence)
    },
    onError: (error) => console.error(error),
  })

  const competencesAvailableToAdd = useMemo(
    () =>
      availableCompetences.filter(
        ({ competenceId }) =>
          !competences.fields.some(
            ({ competence }) => competenceId === competence.competenceId,
          ),
      ),
    [competences],
  )

  return (
    <Stack spacing={2} alignItems="flex-start">
      <FormProvider {...methods}>
        <Typography variant="h1" gutterBottom>
          Your competences
        </Typography>
        {competencesAvailableToAdd.length > 0 && (
          <>
            <Button
              variant="contained"
              onClick={(e) => setCreateAnchor(e.currentTarget)}
              startIcon={
                addMutation.isLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : (
                  <AddRounded />
                )
              }
            >
              Add new competence
            </Button>
            <Popover
              open={createAnchor !== null}
              anchorEl={createAnchor}
              onClose={() => setCreateAnchor(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <List>
                {competencesAvailableToAdd.map((competence) => (
                  <ListItem disablePadding key={competence.competenceId}>
                    <ListItemButton
                      onClick={() =>
                        addMutation.mutate({ competence, yearsOfExperience: 0 })
                      }
                    >
                      <ListItemText primary={competence.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Popover>
          </>
        )}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell width={400}>Competence</TableCell>
                <TableCell width={300}>Years&nbsp;of&nbsp;experience</TableCell>
                <TableCell padding="checkbox"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competences.fields.map((field, index) => (
                <CompetenceManagerTableRow
                  key={field.id}
                  field={field}
                  index={index}
                  onDelete={() => competences.remove(index)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </FormProvider>
    </Stack>
  )
}
