import {
  Stack,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  InputBase,
  TableBody,
  IconButton,
  Popover,
  ListItemButton,
} from '@mui/material'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Application, Competence, CompetenceProfile } from '../../../util/Types'
import { useFieldArray, useForm, SubmitHandler } from 'react-hook-form'
import { AddRounded, DeleteRounded } from '@mui/icons-material'

type FormValues = {
  competenceProfile: CompetenceProfile
}

export default function CompetenceManagerPage({
  availableCompetences,
  competenceProfile,
}: {
  availableCompetences: Competence[]
  competenceProfile: CompetenceProfile
}) {
  const { control, register, handleSubmit } = useForm<FormValues>({
    defaultValues: { competenceProfile },
  })
  const competences = useFieldArray({
    control,
    name: 'competenceProfile',
  })

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleAddCompetence = (competenceId: number) => () => {
    const competence = availableCompetences.find(
      (comp) => comp.competenceId === competenceId,
    )
    if (competence === undefined) return

    competences.prepend({ competence, yearsOfExperience: 0 })
    setAnchorEl(null)
  }

  const onSubmit: SubmitHandler<FormValues> = (d) => {
    console.log(d)
  }

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
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      spacing={2}
      alignItems="flex-start"
    >
      <Typography variant="h1" gutterBottom>
        Your competences
      </Typography>
      {competencesAvailableToAdd.length > 0 && (
        <>
          <Button
            variant="contained"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            startIcon={<AddRounded />}
          >
            Add new competence
          </Button>
          <Popover
            open={anchorEl !== null}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <List>
              {competencesAvailableToAdd.map((competence) => (
                <ListItem disablePadding key={competence.competenceId}>
                  <ListItemButton onClick={handleAddCompetence(competence.competenceId)}>
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
              <TableCell>Competence</TableCell>
              <TableCell>Years&nbsp;of&nbsp;experience</TableCell>
              <TableCell padding="checkbox"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {competences.fields.map((field, index) => (
              <TableRow
                key={field.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {field.competence.name}
                </TableCell>
                <TableCell>
                  <InputBase
                    {...register(`competenceProfile.${index}.yearsOfExperience`, {
                      valueAsNumber: true,
                    })}
                  />
                </TableCell>
                <TableCell padding="checkbox">
                  <IconButton onClick={() => competences.remove(index)}>
                    <DeleteRounded />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" type="submit">
        Send Application
      </Button>
    </Stack>
  )
}
