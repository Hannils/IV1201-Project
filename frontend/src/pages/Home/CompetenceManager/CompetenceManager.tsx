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
import { Application, Competence } from '../../../util/Types'
import { useFieldArray, useForm } from 'react-hook-form'
import { AddRounded, DeleteRounded } from '@mui/icons-material'

const application: Application = {
  competenceProfile: [
    //{ competence: 'Good at working', yearsOfExperience: 1 },
    //{ competence: 'Very good at working', yearsOfExperience: 2 },
    //{ competence: 'Excellent at working', yearsOfExperience: 3 },
  ],
  status: 'unhandled',
  availability: [{ startDate: new Date('2009-09-09'), endDate: new Date('2009-10-09') }],
}

const availableCompatences = ['Cash register', 'Restocking', 'IDK example maybe']

type FormValues = {
  competenceProfile: Competence[]
}

export default function CompetenceManager() {
  const { control, register } = useForm<FormValues>()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const competences = useFieldArray({
    control,
    name: 'competenceProfile',
  })

  const handleAddCompetence = (competence: string) => () => {
    competences.prepend({ competence, yearsOfExperience: 0 })
    setAnchorEl(null)
  }

  const competencesAvialbleToAdd = useMemo(
    () =>
      availableCompatences.filter((comp) =>
        !competences.fields.some(({ competence }) => comp === competence),
      ),
    [competences],
  )

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h1" gutterBottom>
        Your competences
      </Typography>
      {competencesAvialbleToAdd.length > 0 && (
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
              {competencesAvialbleToAdd.map((competence) => (
                <ListItem disablePadding key={competence}>
                  <ListItemButton onClick={handleAddCompetence(competence)}>
                    <ListItemText primary={competence} />
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
                  {field.competence}
                </TableCell>
                <TableCell>
                  <InputBase
                    {...register(`competenceProfile.${index}.yearsOfExperience`)}
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
      {/* <Select multiple value={competenceName} onChange={handleChange}>
        {competences.map((competence) => (
          <MenuItem key={competence} value={competence}>
            <Checkbox checked={competenceName.indexOf(competence) > -1} />
            <ListItemText primary={competence} />
          </MenuItem>
        ))}
      </Select> */}
    </Stack>
  )
}
