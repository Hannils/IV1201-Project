import { DeleteRounded } from '@mui/icons-material'
import { IconButton, InputBase, LinearProgress, TableCell, TableRow } from '@mui/material'
import { Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material'
import React, { useState } from 'react'

import ErrorHandler from '../../../components/ErrorHandler'
import { yearsOfExperienceSchema } from '../../../util/schemas'
import { UserCompetence } from '../../../util/Types'
import { useCompetenceManager } from '../CompetenceManagerContext'

/**
 * Component for displaying competences for a user
 */
export default function CompetenceManagerTable() {
  const { competences, deleteMutation, updateMutation } = useCompetenceManager()

  return (
    <>
      <ErrorHandler
        size="large"
        isError={deleteMutation.isError}
        error={deleteMutation.error}
        sx={{ width: '100%' }}
      />
      <ErrorHandler
        size="large"
        isError={updateMutation.isError}
        error={updateMutation.error}
        sx={{ width: '100%' }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 450 }} aria-label="Table of competences">
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: 0 }} padding="none" height={4.5} colSpan={3}>
                {(deleteMutation.isLoading || updateMutation.isLoading) && (
                  <LinearProgress />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell width={400}>Competence</TableCell>
              <TableCell width={300}>Years&nbsp;of&nbsp;experience</TableCell>
              <TableCell padding="checkbox"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {competences.map((userCompetence, index) => (
              <CompetenceTableRow
                key={userCompetence.competence.competenceId}
                {...{ userCompetence, index }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

interface CompetenceTableRowProps {
  userCompetence: UserCompetence
}

function CompetenceTableRow(props: CompetenceTableRowProps) {
  const { userCompetence } = props
  const { deleteMutation, updateMutation } = useCompetenceManager()

  const [yearsOfExperience, setYearsOfExperience] = useState<number>(
    userCompetence.yearsOfExperience,
  )
  const [localError, setLocalError] = useState<null | unknown>(null)

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setYearsOfExperience(e.target.valueAsNumber)

  const handleUpdate = () => {
    setLocalError(null)
    try {
      yearsOfExperienceSchema.parse(yearsOfExperience)
      updateMutation.mutate({
        yearsOfExperience,
        competenceId: userCompetence.competence.competenceId,
      })
    } catch (error: unknown) {
      setLocalError(error)
    }
  }

  const handleDelete = () => deleteMutation.mutate(userCompetence.competence.competenceId)

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell width={400} component="th" scope="row">
        {userCompetence.competence.name}
      </TableCell>
      <TableCell width={300}>
        <InputBase
          type="number"
          inputMode="numeric"
          value={yearsOfExperience}
          onChange={handleInput}
          onBlur={handleUpdate}
        />
        <ErrorHandler size="small" isError={localError !== null} error={localError} />
      </TableCell>
      <TableCell padding="checkbox">
        <IconButton onClick={handleDelete} disabled={deleteMutation.isLoading}>
          <DeleteRounded />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
