import { Role } from '../../util/Types'
import { queryDatabase } from './DAO'

/**
 * Gets the role id from a role name
 * @param role - Name of the role as `Role`
 * @returns Id of the given role name as `number`
 */
export async function getRoleId(role: Role) {
  const response = await queryDatabase(`SELECT role_id FROM role WHERE name = $1 `, [
    role,
  ])
  return response.rows[0].role_id
}
