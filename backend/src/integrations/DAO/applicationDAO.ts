import {
  IncompletePerson,
  IncompletePersonSchema,
  Person,
  PersonSchema,
  Role,
} from '../../util/Types'
import { queryDatabase } from './DAO'

/**
 * This function calls database and retrieves an id
 * @param role the name of the role as `Role`
 * @returns the id of the role as `Promise<number>`
 */
export async function getRoleId(role: Role) {
  const response = await queryDatabase(`SELECT role_id FROM role WHERE name = $1 `, [
    role,
  ])

  return response.rows[0].role_id
}
