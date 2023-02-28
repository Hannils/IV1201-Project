import { z } from 'zod'

import { ApplicationStatusSchema } from '../../util/schemas'
import { ApplicationStatusState } from '../../util/Types'
import { queryDatabase } from './DAO'

/**
 * Converts an object with status_id and name properties to an application status object
 * @param x - The input object as any
 * @returns Application status object with statusId and name properties
 */
function toApplicationStatus(x: any) {
  if (!x) return null
  return {
    statusId: x.status_id,
    name: x.name,
  }
}

/**
 * Gets the status id from a status name
 * @param status - Name of the status as {@link ApplicationStatusState}
 * @returns Id of the given status name as `number`
 */
export async function selectApplicationStatusId(status: ApplicationStatusState) {
  const response = await queryDatabase(`SELECT status_id FROM status WHERE name = $1 `, [
    status,
  ])
  return response.rows[0].status_id
}

/**
 * Gets the all application statuses
 * @returns All application statuses as {@link ApplicationStatus}[]
 */
export async function selectApplicationStatus() {
  const response = await queryDatabase(`SELECT * FROM status`, [])
  const statusSchema = z.array(ApplicationStatusSchema)

  return statusSchema.parse(response.rows.map(toApplicationStatus))
}
