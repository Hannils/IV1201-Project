import { z } from 'zod'

import { IncompletePersonSchema, PersonSchema } from '../../util/schemas'
import { Person, Role } from '../../util/Types'
import { queryDatabase } from './DAO'
import { getRoleId } from './roleDAO'

const PERSON_SELECT = `person_id, username, person.name as firstname, surname as lastname, role.name as role, email, person_number, password, salt`
const PERSON_VALIDATOR = `person.username IS NOT NULL AND person.password IS NOT NULL AND person.salt IS NOT NULL`

/**
 * Util function for parsing db output to match scheme of {@link Person}
 * @param x Database output
 * @returns Person as {@link Person}
 */
function toPerson(x: any) {
  if (!x) return null
  return {
    ...x,
    personNumber: x.person_number,
    personId: x.person_id,
  }
}
/**
 * Inserts a person into database
 * @param person - The person to insert as {@link Person}
 * @returns `void`
 */
export async function insertPerson(person: Omit<Person, 'personId'>) {
  const response = await queryDatabase(
    `
    INSERT INTO person(person_number, name, surname, email, username, password, role_id, salt) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING person_id
    `,
    [
      person.personNumber,
      person.firstname,
      person.lastname,
      person.email,
      person.username,
      person.password,
      await getRoleId(person.role),
      person.salt,
    ],
  )

  return response.rows[0].person_id as number
}

/**
 * Drops a person row from the database
 * @param personId - Id of the person to drop as `number`
 * @returns `void`
 */
export async function dropPerson(personId: number) {
  await queryDatabase(
    `
      DELETE from person 
      WHERE person_id = $1
    `,
    [personId],
  )
}

/**
 * Calls database and selects a specific person from personId
 * @param personId - Id of the person to select as `number`
 * @returns Person as {@link Person} || `null`
 */
export async function selectPersonById(personId: number) {
  const response = await queryDatabase(
    `
        SELECT ${PERSON_SELECT} FROM person 
        INNER JOIN public.role ON role.role_id = person.role_id 
        WHERE person_id = $1 AND ${PERSON_VALIDATOR}
      `,
    [personId],
  )

  const personParse = PersonSchema.safeParse(toPerson(response.rows[0]))

  if (personParse.success) return personParse.data

  return null
}
/**
 * Calls database and selects a specific person from email
 * @param email - Email of the person as `string`
 * @returns Person as {@link Person} || `null`
 */
export async function selectPersonByEmail(email: string) {
  const response = await queryDatabase(
    `
        SELECT ${PERSON_SELECT} FROM person 
        INNER JOIN public.role ON role.role_id = person.role_id 
        WHERE email = $1 AND ${PERSON_VALIDATOR}
      `,
    [email],
  )

  const personParse = PersonSchema.safeParse(toPerson(response.rows[0]))

  if (personParse.success) return personParse.data

  return null
}

/**
 * Calls database and selects a specific person from username
 * @param username - Username of the person as `string`
 * @returns Person as {@link Person} | `null`
 */
export async function selectPersonByUsername(username: string, shouldLock: boolean = false) {
  const response = await queryDatabase(
    `
      SELECT ${PERSON_SELECT} FROM person 
      INNER JOIN public.role ON role.role_id = person.role_id 
      WHERE username = $1 AND ${PERSON_VALIDATOR}${shouldLock ? ' FOR UPDATE' : ''}
    `,
    [username],
  )
  const personParse = PersonSchema.safeParse(toPerson(response.rows[0]))

  if (personParse.success) return personParse.data

  return null
}

/**
 * Calls database and selects all people with a specific role
 * @param role - Role to match the people to as {@link Role}
 * @returns Multiple people as {@link Person}[]
 */
export async function selectPeopleByRole(role: Role) {
  const response = await queryDatabase(
    `
        SELECT ${PERSON_SELECT} FROM public.person 
        INNER JOIN public.role ON role.role_id = person.role_id 
        WHERE role.name = $1 AND ${PERSON_VALIDATOR}
      `,
    [role],
  )

  const peopleSchema = z.array(PersonSchema)
  return peopleSchema.parse(response.rows.map(toPerson))
}

/**
 * Calls database and selects a non-migrated user by email
 * @param email - Email of the non-migrated user as `string`
 * @returns Non-migrated user as {@link IncompletePerson} || `null`
 */
export async function selectIncompletePersonByEmail(email: string) {
  const { rowCount, rows } = await queryDatabase(
    `
        SELECT ${PERSON_SELECT} FROM public.person
        INNER JOIN public.role ON role.role_id = person.role_id 
        WHERE email=$1 AND password IS NULL AND username IS NULL
    `,
    [email],
  )

  if (rowCount === 0) return null

  return IncompletePersonSchema.parse(toPerson(rows[0]))
}

/**
 * Calls database and migrates a non-migrated user
 * @param username - New username of the user
 * @param password - New password of the user
 * @param salt - Salt of the user
 * @param personId - Id of the user
 * @returns `void`
 */
export async function migratePerson({
  username,
  password,
  salt,
  personId,
}: {
  username: string
  password: string
  salt: string
  personId: number
}) {
  await queryDatabase(
    `
        UPDATE public.person 
        SET username = $1, password = $2, salt = $3 WHERE person_id = $4
    `,
    [username, password, salt, personId],
  )
}
