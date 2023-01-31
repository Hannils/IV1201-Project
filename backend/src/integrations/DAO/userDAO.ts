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

const PERSON_SELECT = `
  person_id, username, person.name as firstname, surname as lastname, role.name as role, email, person_number, password, salt
`

function toPerson(x: any) {
  if (!x) return null
  return {
    ...x,
    personNumber: x.person_number,
    personId: x.person_id,
  }
}

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

export async function dropPerson(personId: number) {
  await queryDatabase(
    `
      DELETE from person 
      WHERE person_id = $1
    `,
    [personId],
  )
}

export async function selectPersonById(personId: number) {
  const response = await queryDatabase(
    `
        SELECT ${PERSON_SELECT} FROM person 
        INNER JOIN public.role ON role.role_id = person.role_id 
        WHERE person_id = $1
      `,
    [personId],
  )

  const personParse = PersonSchema.safeParse(toPerson(response.rows[0]))

  if (personParse.success) return personParse.data

  return null
}

export async function selectPersonByEmail(email: string) {
  const response = await queryDatabase(
    `
        SELECT ${PERSON_SELECT} FROM person 
        INNER JOIN public.role ON role.role_id = person.role_id 
        WHERE email = $1
      `,
    [email],
  )

  const personParse = PersonSchema.safeParse(toPerson(response.rows[0]))

  if (personParse.success) return personParse.data

  return null
}

export async function selectPersonByUsername(username: string) {
  const response = await queryDatabase(
    `
      SELECT ${PERSON_SELECT} FROM person 
      INNER JOIN public.role ON role.role_id = person.role_id 
      WHERE username = $1
    `,
    [username],
  )

  const personParse = PersonSchema.safeParse(toPerson(response.rows[0]))

  if (personParse.success) return personParse.data

  return null
}

/**
 * Function to select all people with a specific entered role
 * @param role a role
 */
export async function selectPeopleByRole(role: Role) {
  const response = await queryDatabase(
    `
        SELECT ${PERSON_SELECT} FROM public.person 
        INNER JOIN public.role ON role.role_id = person.role_id 
        WHERE role.name = $1
      `,
    [role],
  )

  const peopleSchema = z
    .array(PersonSchema)
    .transform((as) => as.filter((a) => PersonSchema.safeParse(a).success))

  return peopleSchema.parse(response.rows.map(toPerson))
}
