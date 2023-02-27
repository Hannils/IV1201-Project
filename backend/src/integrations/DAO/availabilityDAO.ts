import { z } from 'zod'

import { AvailabilitySchema } from '../../util/schemas'
import { queryDatabase } from './DAO'

/**
 * Util function for parsing db output to match schmeme of {@link Availability}
 * @param x Database output
 * @returns Availability as {@link Availability}
 */
function toAvailability(x: any) {
  if (!x) return null
  return {
    availabilityId: x.availability_id,
    personId: x.person_id,
    fromDate: x.from_date,
    toDate: x.to_date,
  }
}

/**
 * Calls database and retrieves the availability for a speicific person
 * @param personId Id of the person's avaiability row to retrieve as `number`
 * @returns Availability as {@link Availability}[]
 */
export async function selectAvailabilitiesByPersonId(
  personId: number,
  shouldLock = false,
) {
  const response = await queryDatabase(
    `SELECT * FROM availability WHERE person_id = $1 ORDER BY from_date asc${
      shouldLock ? ' FOR UPDATE' : ''
    }`,
    [personId],
  )
  return z.array(AvailabilitySchema).parse(response.rows.map(toAvailability))
}

/**
 * Calls database and retrieves all availabilities
 * @returns All availabilites as {@link Availability}
 */
export async function selectAvailabilities() {
  const response = await queryDatabase(`SELECT * FROM availability`, [])
  const availabilitySchema = z.array(AvailabilitySchema)
  return availabilitySchema.parse(response.rows.map(toAvailability))
}

/**
 * Inserts availability row into database
 * @param personId Id of the person that the row corresponds to as `number`
 * @param fromDate Date of the start of the available period as `Date`
 * @param toDate Date fo the end of the available period as `Date`
 * @returns `void`
 */
export async function insertAvailability(personId: number, fromDate: Date, toDate: Date) {
  const res = await queryDatabase(
    `INSERT INTO availability(person_id, from_date, to_date) VALUES($1, $2, $3) RETURNING availability_id`,
    [personId, fromDate, toDate],
  )

  return res.rows[0].availability_id as number
}

/**
 * Drops a availability row from the database
 * @param availabilityId Id of the row to drop
 * @returns `void`
 */
export async function dropAvailability(availabilityId: number) {
  await queryDatabase(`DELETE FROM availability WHERE availability_id = $1`, [
    availabilityId,
  ])
}

/**
 * Calls database and updates an availability row
 * @param availabilityId Id of the availability to update
 * @param fromDate New date of the start of the available period as `Date`
 * @param toDate New date of the end of the available period as `Date`
 * @returns `void`
 */
export async function updateAvailability(
  availabilityId: number,
  fromDate: Date,
  toDate: Date,
) {
  await queryDatabase(
    `UPDATE availability SET from_date = $1, to_date = $2 WHERE availability_id = $3`,
    [fromDate, toDate, availabilityId],
  )
}
