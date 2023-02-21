import { z } from 'zod'

import { CompetenceSchema, UserCompetenceSchema } from '../../util/schemas'
import { UserCompetence } from '../../util/Types'
import { queryDatabase } from './DAO'

/**
 * Util function for parsing db output to match scheme of {@link UserCompetence}
 * @param x Database output
 * @returns User competence as {@link UserCompetence}
 */
function toUserCompetence(x: any) {
  if (!x) return null
  return {
    competence: {
      competenceId: x.competence_id,
      name: x.name,
    },
    yearsOfExperience: Number(x.years_of_experience),
  }
}

/**
 * Util function for parsing db output to match scheme of {@link Competence}
 * @param x Database output
 * @returns Competece as {@link Competence}
 */
function toCompetence(x: any) {
  if (!x) return null
  return {
    competenceId: x.competence_id,
    name: x.name,
  }
}

/**
 * Calls database and selects all competences
 * @returns Competences as {@link Competence}[]
 * @requires Database
 */
export async function selectCompetence() {
  const response = await queryDatabase(`SELECT * FROM competence`, [])
  const competencesSchema = z.array(CompetenceSchema)

  return competencesSchema.parse(response.rows.map(toCompetence))
}

/**
 * Calls database and selects a competence profile for a specific person
 * @param personId - Id of the person as `number`
 * @returns Competence profile as {@link CompetenceProfile}
 */
export async function selectCompetenceProfile(personId: number) {
  const response = await queryDatabase(
    `
        SELECT competence.competence_id, years_of_experience, name FROM public.competence_profile
        INNER JOIN public.competence ON competence_profile.competence_id=competence.competence_id
        WHERE person_id=$1
    `,
    [personId],
  )

  return z.array(UserCompetenceSchema).parse(response.rows.map(toUserCompetence))
}
/**
 * Calls database and inserts a user competence for a person
 * @param  userCompetence - Competence to be inserted as {@link UserCompetence}
 * @param  personId - Id of the person to insert into as `number`
 * @returns `void`
 * @requires Database
 */
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
/**
 * Calls database and deletes a user competence for a specific person
 * @param personId - Id of the person as `number`
 * @param competenceId - Id of the competence to remove as `number`
 * @returns `void`
 * @requires Database
 */
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
/**
 * Calls database and updates a user competence for a specific person
 * @param personId - Id of the person as `number`
 * @param competenceId - Id of the competence to update as `number`
 * @param yearsOfExperience - `number`
 * @returns `void`
 * @requires Database
 */
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
