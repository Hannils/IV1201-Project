import { z}  from 'zod'
import { AvailabilitySchema } from '../../util/Types'
import { queryDatabase } from './DAO'
import { Availability } from '../../util/Types'


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
        toDate: x.to_date
    }
}

/**
 * Calls database and retrieves specific availability
 * @param availabilityId Id of the availability row to retrieve as `number`
 * @returns Availability as {@link Availability}
 */
export async function selectAvailability(availabilityId: number) {
    const response = await queryDatabase(`SELECT * FROM availability WHERE availability_id = $1`, [availabilityId])
    if (response.rowCount === 0) return null
    return AvailabilitySchema.parse(toAvailability(response.rows[0]))
}


/**
 * Calls database and retrieves all availabilities
 * @returns All availabilites as {@link Availability}[]
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
 */
export async function insertAvailability(personId: number, fromDate: Date, toDate: Date) {
    await queryDatabase(`INSERT INTO availability(person_id, from_date, to_date) VALUES($1, $2, $3)`, [personId, fromDate, toDate])
}

/**
 * Drops a availability row from the database
 * @param availabilityId Id of the row to drop
 */
export async function dropAvailability(availabilityId: number) {
    await queryDatabase(`DELETE FROM availability WHERE availability_id = $1`, [availabilityId])
}

/**
 * Calls database and updates an availability row
 * @param availabilityId Id of the availability to update
 * @param fromDate New date of the start of the available period as `Date`
 * @param toDate New date of the end of the available period as `Date`
 */
export async function updateAvailability(availabilityId: number, fromDate: Date, toDate: Date) {
    await queryDatabase(`UPDATE availability SET from_date = $1, to_date = $2 WHERE availability_id = $3`, [fromDate, toDate, availabilityId])
}


