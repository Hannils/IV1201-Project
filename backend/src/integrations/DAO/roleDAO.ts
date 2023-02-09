/** 
 * This file contains the functions that interact with the role table in the database
 * 
  * @packageDocumentation
  * @module RoleDAO
  * @preferred
  * @category DAO
  * @category Role
  */
import {
  IncompletePerson,
  IncompletePersonSchema,
  Person,
  PersonSchema,
  Role,
} from '../../util/Types'
import { queryDatabase } from './DAO'


/**
 * Gets the role_id of a role
 * @param role The role to get the role_id of
 * @returns The role_id of the role
 * depends on queryDatabase
 */
export async function getRoleId(role: Role) {
  const response = await queryDatabase(`SELECT role_id FROM role WHERE name = $1 `, [
    role,
  ])

  return response.rows[0].role_id
}
