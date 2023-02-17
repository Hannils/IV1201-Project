import { z}  from 'zod'
import { AvailabilitySchema } from '../../util/Types'
import { queryDatabase } from './DAO'

function toAvailability(x: any) {
    if (!x) return null
    return {
        availabilityId: x.availability_id,
        personId: x.person_id,
        fromDate: x.from_date,
        toDate: x.to_date
    }
}

export async function selectAvailability(availabilityId: number) {
    const response = await queryDatabase(`SELECT * FROM availability WHERE availability_id = $1`, [availabilityId])
    if (response.rowCount === 0) return null
    return AvailabilitySchema.parse(toAvailability(response.rows[0]))
}

export async function selectAvailabilities() {
    const response = await queryDatabase(`SELECT * FROM availability`, [])
    const availabilitySchema = z.array(AvailabilitySchema)
    return availabilitySchema.parse(response.rows.map(toAvailability))
}

export async function insertAvailability(personId: number, fromDate: Date, toDate: Date) {
    await queryDatabase(`INSERT INTO availability(person_id, from_date, to_date) VALUES($1, $2, $3)`, [personId, fromDate, toDate])
}

export async function dropAvailability(availabilityId: number) {
    await queryDatabase(`DELETE FROM availability WHERE availability_id = $1`, [availabilityId])
}

export async function updateAvailability(availabilityId: number, fromDate: Date, toDate: Date) {
    await queryDatabase(`UPDATE availability SET from_date = $1, to_date = $2 WHERE availability_id = $3`, [fromDate, toDate, availabilityId])
}


