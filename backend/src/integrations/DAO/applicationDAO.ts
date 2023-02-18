import { z } from 'zod'

import { ApplicationSchema, Person } from '../../util/Types'
import { queryDatabase } from './DAO'
import { Application, Opportunity } from '../../util/Types'
import { selectStatusId } from './statusDAO'

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
    status: x.status,
    opportunity: {
      opportunityId: x.opportunity_id,
      applicationPeriodStart: x.application_period_start,
      applicationPeriodEnd: x.application_period_end,
      name: x.name,
    },
  }
}

const APPLICATION_SELECT =
  'application_id, person_id, status.name as status, opportunity.name, opportunity.opportunity_id, application_period_start, application_period_end'
const APPLICATION_JOINS = `
                            INNER JOIN status ON status.status_id = application.status_id
                            INNER JOIN opportunity ON opportunity.opportunity_id = application.opportunity_id
                          `

/**
 * Calls database and retrieves specific application
 * @param applicationId Id of the specific application as `number`
 * @returns Application as {@link Application}
 */
export async function selectApplication(applicationId: number) {
  const response = await queryDatabase(
    `
        SELECT ${APPLICATION_SELECT} FROM application
        ${APPLICATION_JOINS}
        WHERE application_id = $1
    `,
    [applicationId],
  )
  if (response.rowCount === 0) return null
  return ApplicationSchema.parse(toApplication(response.rows[0]))
}

/**
 * Calls database and retrieves specific application
 * @param personId Id of a {@link Person} as `number`
 * @param opportunityId Id of an {@link Opportunity} as `number`
 * @returns Application as {@link Application}
 */
export async function selectApplicationByPersonAndOpportunity(
  personId: number,
  opportunityId: number,
) {
  const response = await queryDatabase(
    `
        SELECT ${APPLICATION_SELECT} FROM application
        ${APPLICATION_JOINS}
        WHERE person_id = $1 AND application.opportunity_id = $2
    `,
    [personId, opportunityId],
  )
  if (response.rowCount === 0) return null
  return ApplicationSchema.parse(toApplication(response.rows[0]))
}

export async function selectApplicationsByPersonId(personId: number) {
  const response = await queryDatabase(
    `
            SELECT ${APPLICATION_SELECT} FROM application
            ${APPLICATION_JOINS}
            WHERE person_id = $1
        `,
    [personId],
  )

  return z.array(ApplicationSchema).parse(response.rows.map(toApplication))
}

/**
 * Inserts an application into the database
 * @param personId Id of the applications person as `number`
 * @returns `void`
 */
export async function insertApplication(personId: number, opportunityId: number) {
  await queryDatabase(
    `INSERT INTO application(person_id, status_id, opportunity_id) VALUES($1, $2, $3)`,
    [personId, await selectStatusId('unhandled'), opportunityId],
  )
}

/**
 * Drops a specific row from the application table
 * @param applicationId Id of the row to drop
 */
export async function dropApplication(applicationId: number) {
  await queryDatabase(`DELETE FROM application WHERE application_id = $1`, [
    applicationId,
  ])
}
