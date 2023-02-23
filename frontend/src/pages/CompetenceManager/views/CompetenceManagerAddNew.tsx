import { AddRounded } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from '@mui/material'
import React, { useMemo, useState } from 'react'

import { Competence } from '../../../util/Types'
import { useCompetenceManager } from '../CompetenceManagerContext'

/**
 * Component for adding new competences
 */
export default function CompetenceManagerAddNew() {
  const [createAnchor, setCreateAnchor] = useState<HTMLButtonElement | null>(null)
  const { competences, availableCompetences, addMutation } = useCompetenceManager()

  const competencesAvailableToAdd = useMemo(
    () =>
      availableCompetences.filter(
        ({ competenceId }) =>
          !competences.some(({ competence }) => competenceId === competence.competenceId),
      ),
    [competences],
  )

  const handleAdd = (competence: Competence) => () => {
    setCreateAnchor(null)
    addMutation.mutate({ competence, yearsOfExperience: 0 })
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={(e) => setCreateAnchor(e.currentTarget)}
        disabled={addMutation.isLoading}
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
              <ListItemButton onClick={handleAdd(competence)}>
                <ListItemText primary={competence.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  )
}
