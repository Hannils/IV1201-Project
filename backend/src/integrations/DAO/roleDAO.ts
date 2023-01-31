import {
  IncompletePerson,
  IncompletePersonSchema,
  Person,
  PersonSchema,
  Role,
} from '../../util/Types'
import { queryDatabase } from './DAO'

export async function getRoleId(role: Role) {
  const response = await queryDatabase(`SELECT role_id FROM role WHERE name = $1 `, [
    role,
  ])

  return response.rows[0].role_id
}
