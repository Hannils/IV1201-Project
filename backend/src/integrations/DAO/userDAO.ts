/**
 * @fileoverview This file contains all the functions that are used to interact with the database
 */
import {
  IncompletePerson,
  IncompletePersonSchema,
  Person,
  PersonSchema,
  Role,
} from '../../util/Types'
import { queryDatabase } from './DAO'
import { getRoleId } from './roleDAO'
import { z } from 'zod'

const PERSON_SELECT = `person_id, username, person.name as firstname, surname as lastname, role.name as role, email, person_number, password, salt`

const PERSON_VALIDATOR = `person.username IS NOT NULL AND person.password IS NOT NULL AND person.salt IS NOT NULL`

function toPerson(x: any) {
  if (!x) return null
  return {
    ...x,
    personNumber: x.person_number,
    personId: x.person_id,
  }
}
/**
 * Inserts person into a database
 * @param person - The person to insert as `Person`
 * @returns void
 * @requires Database
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
 * @returns void
 * @requires Database
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
 * @returns Person
 * @requires Database
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
 * @param email - Email of the person
 * @returns Person
 * @requires Database
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
 * @param username - Username of the person
 * @returns Person | null
 * @requires Database
 */
export async function selectPersonByUsername(username: string) {
  const response = await queryDatabase(
    `
      SELECT ${PERSON_SELECT} FROM person 
      INNER JOIN public.role ON role.role_id = person.role_id 
      WHERE username = $1 AND ${PERSON_VALIDATOR}
    `,
    [username],
  )
  const personParse = PersonSchema.safeParse(toPerson(response.rows[0]))

  if (personParse.success) return personParse.data

  return null
}

/**
 * Calls database and selects all people with a specific role
 * @param role - Role to match the people to as `Role`
 * @returns People[]
 * @requires Database
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
 * Calls database and updates a person with a specific id
 * @param personId - Id of the person to update as `number`
 * @param person - The person to update as `Person`
 * @returns void
 * @requires Database
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
 * Calls database and updates a person with a specific id
 * @param personId - Id of the person to update as `number`
 * @param person - The person to update as `Person`
 * @returns void
 * @requires Database
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
