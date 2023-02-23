import { z } from 'zod'
import { Person } from '../../util/Types'
import { queryDatabase } from './DAO'
import { Application, Opportunity } from '../../util/Types'
import { selectApplicationStatusId } from './statusDAO'
import { ApplicationSchema, ApplicationPreviewSchema } from '../../util/schemas'

/**
 * Util function for parsing db output to match scheme of {@link Application}
 * @param x Database output
 * @returns Application as {@link Application}
 */
function toApplication(x: any) {
  if (!x) return null
  console.log(x)
  return {
    applicationId: x.application_id,
    personId: x.person_id,
    status: {
      name: x.status,
      statusId: x.status_id,
    },
    opportunity: {
      opportunityId: x.opportunity_id,
      applicationPeriodStart: x.application_period_start,
      applicationPeriodEnd: x.application_period_end,
      name: x.name,
    },
  }
}

/**
 * Maps an application preview object to the expected format for responses.
 * @param {any} x - The application preview object to be mapped.
 * @returns {Object|null} The application preview object mapped to the expected format, or `null` if `x` is falsy.
 * @description
 * The returned object has the following properties:
 * - `applicationId`: The ID of the application.
 * - `status`: An object containing the name and ID of the application's status.
 * - `person`: The person object associated with the application.
 * - `competences`: An array of objects containing the years of experience and competence profile for the application.
 */

function toApplicationPreview(x: any) {
  if (!x) return null
  return {
    applicationId: x.application_id,
    status: {
      name: x.status,
      statusId: x.status_id,
    },
    person: x.person,
    competences: x.competence_profile.map(
      ({ yearsOfExperience, ...c }: { yearsOfExperience: any }) => ({
        yearsOfExperience,
        competence: c,
      }),
    ),
  }
}

/**
 * Calls database and retrieves specific application
 * @param applicationId Id of the specific application as `number`
 * @returns Application as {@link Application}
 */
export async function selectApplication(applicationId: number) {
  const response = await queryDatabase(
    `
        SELECT 'application_id, person_id, status.name as status, application.status_id, opportunity.name, opportunity.opportunity_id, application_period_start, application_period_end' FROM application
        INNER JOIN status ON status.status_id = application.status_id
        INNER JOIN opportunity ON opportunity.opportunity_id = application.opportunity_id
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
        SELECT application_id, person_id, status.name as status, application.status_id, opportunity.name, opportunity.opportunity_id, application_period_start, application_period_end FROM application
        INNER JOIN status ON status.status_id = application.status_id
        INNER JOIN opportunity ON opportunity.opportunity_id = application.opportunity_id
        WHERE person_id = $1 AND application.opportunity_id = $2
    `,
    [personId, opportunityId],
  )
  if (response.rowCount === 0) return null
  return ApplicationSchema.parse(toApplication(response.rows[0]))
}
/**
 * Retrieves all applications associated with a specified person ID from the database.
 * @param personId - The ID of the person associated with the applications.
 * @returns  An array of application objects retrieved from the database.
 * @throws `ZodError` If the data retrieved from the database does not match the expected schema.
 * @description The returned array contains objects with the following properties:
 * - `application_id`: The ID of the application.
 * - `person_id`: The ID of the person associated with the application.
 * - `status`: The name of the application's status.
 * - `name`: The name of the opportunity associated with the application.
 * - `opportunity_id`: The ID of the opportunity associated with the application.
 * - `application_period_start`: The start date of the application period for the opportunity.
 * - `application_period_end`: The end date of the application period for the opportunity.
 */

export async function selectApplicationsByPersonId(personId: number) {
  const response = await queryDatabase(
    `
            SELECT application_id, person_id, status.name as status, application.status_id, opportunity.name, opportunity.opportunity_id, application_period_start, application_period_end FROM application
            INNER JOIN status ON status.status_id = application.status_id
            INNER JOIN opportunity ON opportunity.opportunity_id = application.opportunity_id
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
    [personId, await selectApplicationStatusId('unhandled'), opportunityId],
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

/**
 * Updates the status of an application in the database.
 * @param applicationId - The ID of the application to be updated.
 * @param statusId - The ID of the new status to be assigned to the application.
 * @throws `Error` If an error occurs while updating the application's status in the database.
 * @description Updates the `status_id` column in the `application` table for the application with the specified ID to the new status ID specified.
 */

export async function updateApplicationStatus(applicationId: number, statusId: number) {
  await queryDatabase(`UPDATE application SET status_id=$1 WHERE application_id = $2`, [
    statusId,
    applicationId,
  ])
}

/**
 * Retrieves an array of application preview objects associated with a specified opportunity ID from the database.
 * @param opportunityId - The ID of the opportunity associated with the applications.
 * @returns A promise that resolves to an array of application objects retrieved from the database.
 * @throws `ZodError` If the data retrieved from the database does not match the expected schema.
 * @description The returned array contains objects with the following properties:
 * - `applicationId`: The ID of the application.
 * - `status`: An object containing the name and ID of the application's status.
 * - `person`: An object containing the name, surname, and ID of the person associated with the application.
 * - `competences`: An array of objects containing the years of experience, name, and ID of the competence profile for the application.
 */
export async function selectApplicationPreview(opportunityId: number) {
  const response = await queryDatabase(
    `
      SELECT
        application.application_id,
        status.name as status,
        application.status_id,
        json_build_object(
          'firstname', person.name,
          'lastname', person.surname,
          'personId', person.person_id
        ) AS person,
        json_agg(
          json_build_object(
            'name', competence.name,
            'competenceId', competence.competence_id,
            'yearsOfExperience', competence_profile.years_of_experience
          )
        ) as competence_profile
      FROM person
      JOIN competence_profile ON competence_profile.person_id = person.person_id
      JOIN application ON application.person_id = person.person_id
      JOIN status ON status.status_id=application.status_id
      JOIN competence on competence.competence_id = competence_profile.competence_id
      WHERE opportunity_id = $1
      GROUP BY 
        person.name,
        application.application_id, 
        person.surname, 
        person.person_id,
        status.name
    `,
    [opportunityId],
  )

  console.log('Response', response.rows)
  console.log('Response', response.rows.map(toApplicationPreview))

  return z.array(ApplicationPreviewSchema).parse(response.rows.map(toApplicationPreview))
}
