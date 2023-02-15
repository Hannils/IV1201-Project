import {
  IncompletePerson,
  IncompletePersonSchema,
  Person,
  PersonSchema,
  Role,
} from '../../util/Types'
import { queryDatabase } from './DAO'

function toApplication(x: any) {
  if (!x) return null
  return {
    applicationId: x.application_id,
    personId: x.person_id,
    statusId: x.status_id,
    year: x.year
  }
}

/**
 * This function calls database and retrieves an id
 * @param role the name of the role as `Role`
 * @returns the id of the role as `Promise<number>`
 */
export async function selectApplications() {
  const response = await queryDatabase(`SELECT * FROM application`, [])

  return response.rows[0].role_id
}



export async function insertApplication(personId: number) {
  const response = await queryDatabase(`INSERT INTO application(person_id, status_id, year) VALUES($1, $2, $3)`, [personId, 1, 2023])
}
