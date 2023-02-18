import { ApplicationStatus } from '../../util/Types'
import { queryDatabase } from './DAO'

/**
 * Gets the status id from a status name
 * @param status - Name of the status as {@link ApplicationStatus}
 * @returns Id of the given status name as `number`
 */
export async function selectStatusId(status: ApplicationStatus) {
  const response = await queryDatabase(`SELECT status_id FROM status WHERE name = $1 `, [
    status,
  ])
  return response.rows[0].status_id
}
