// Description: This file contains the functions that interact with the role table in the database
import {
  IncompletePerson,
  IncompletePersonSchema,
  Person,
  PersonSchema,
  Role,
} from '../../util/Types'
import { queryDatabase } from './DAO'

// This function returns the role_id (the role type) of a role
export async function getRoleId(role: Role) {
  const response = await queryDatabase(`SELECT role_id FROM role WHERE name = $1 `, [
    role,
  ])

  return response.rows[0].role_id
}
