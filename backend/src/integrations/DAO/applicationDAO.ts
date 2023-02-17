import { z } from 'zod'

import { ApplicationSchema } from '../../util/Types'
import { queryDatabase } from './DAO'
import { Application } from '../../util/Types'


/**
 * Util function for parsing db output to match scheme of {@link Application}
 * @param x Database output
 * @returns Application as {@link Application}
 */
function toApplication(x: any) {
  if (!x) return null
  return {
    applicationId: x.application_id,
    personId: x.person_id,
    statusId: x.status_id,
    year: x.year,
  }
}

/**
 * Calls database and retrieves all applications
 * @returns All applications as {@link Application}[]
 */
export async function selectApplications() {
  const response = await queryDatabase(`SELECT * FROM application`, [])
  const applicationScheme = z.array(ApplicationSchema)
  return ApplicationSchema.parse(response.rows.map(toApplication))
}


/**
 * Calls database and retrieves specific application
 * @param applicationId Id of the specific application as `number`
 * @returns Application as {@link Application}
 */
export async function selectApplication(applicationId: number) {
  const response = await queryDatabase(
    `SELECT * FROM application WHERE application_id = $1`,
    [applicationId],
  )
  return response
}

/**
 * Inserts an application into the database
 * @param personId Id of the applications person as `number`
 * @returns `void`
 */
export async function insertApplication(personId: number) {
  const response = await queryDatabase(
    `INSERT INTO application(person_id, status_id, year) VALUES($1, $2, $3)`,
    [personId, 1, 2023],
  )
}

/**
 * Drops a specific row from the application table
 * @param applicationId Id of the row to drop
 */
export async function dropApplication(applicationId: number) {
  await queryDatabase(`DELETE FROM application WHERE application_id = $1`, [applicationId])
}
