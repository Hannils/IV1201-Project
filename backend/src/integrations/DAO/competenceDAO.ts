// Description: This file contains the functions that interact with the role table in the database
import { CompetenceSchema, UserCompetenceSchema, UserCompetence } from '../../util/Types'
import { queryDatabase } from './DAO'
import { z } from 'zod'

function toCompetenceProfile(x: any) {
  if (!x) return null
  return {
    competence: {
      competenceId: x.competence_id,
      name: x.name,
    },
    yearsOfExperience: Number(x.years_of_experience),
  }
}

function toCompetence(x: any) {
  if (!x) return null
  return {
    competenceId: x.competence_id,
    name: x.name,
  }
}

// This function returns the role_id (the role type) of a role
export async function selectCompetence() {
  const response = await queryDatabase(`SELECT * FROM competence`, [])
  const competencesSchema = z.array(CompetenceSchema)

  return competencesSchema.parse(response.rows.map(toCompetence))
}

export async function selectCompetenceProfile(personId: string) {
  const response = await queryDatabase(
    `
        SELECT competence.competence_id, years_of_experience, name FROM public.competence_profile
        INNER JOIN public.competence ON competence_profile.competence_id=competence.competence_id
        WHERE person_id=$1
    `,
    [personId],
  )

  return z.array(UserCompetenceSchema).parse(response.rows.map(toCompetenceProfile))
}

export async function insertUserCompetence(
  userCompetence: UserCompetence,
  personId: number,
) {
  await queryDatabase(
    `
        INSERT INTO competence_profile(person_id, competence_id, years_of_experience)
        VALUES($1, $2, $3)
    `,
    [personId, userCompetence.competence.competenceId, userCompetence.yearsOfExperience],
  )
}

export async function dropUserCompetence({
  personId,
  competenceId,
}: {
  personId: number
  competenceId: number
}) {
  await queryDatabase(
    `
            DELETE FROM competence_profile 
            WHERE person_id=$1 AND competence_id=$2
    `,
    [personId, competenceId],
  )
}

export async function updateUserCompetence({
  personId,
  competenceId,
  yearsOfExperience,
}: {
  personId: number
  competenceId: number
  yearsOfExperience: number
}) {
  await queryDatabase(
    `
        UPDATE competence_profile
        SET years_of_experience = $1 WHERE person_id = $2 AND competence_id = $3
    `,
    [yearsOfExperience, personId, competenceId],
  )
}
