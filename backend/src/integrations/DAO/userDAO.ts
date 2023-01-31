import {
  IncompletePerson,
  IncompletePersonSchema,
  Person,
  PersonSchema,
  Role,
} from '../../util/Types'
import { queryDatabase } from './DAO'
import { getRoleId } from './roleDAO'

function parseToPersonType(x: unknown) {
  const personParse = PersonSchema.safeParse(x)

  if (personParse.success) return personParse.data

  const incompletePersonParse = IncompletePersonSchema.safeParse(x)

  if (incompletePersonParse.success) return incompletePersonParse.data

  return null
}

export async function insertPerson(person: Person) {
  await queryDatabase(
    `
    INSERT INTO person(person_number, name, surname, email, username, password, role_id, salt) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
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
        SELECT * FROM person 
        WHERE person_id = $1
      `,
    [personId],
  )

  const personParse = PersonSchema.safeParse(response.rows[0])

  if (personParse.success) return personParse.data

  return null
}

export async function selectPersonByEmail(email: string) {
  const response = await queryDatabase(
    `
        SELECT * FROM person 
        WHERE email = $1
      `,
    [email],
  )

  const personParse = PersonSchema.safeParse(response.rows[0])

  if (personParse.success) return personParse.data

  return null
}

export async function selectPersonByUsername(email: string) {
  const response = await queryDatabase(
    `
      SELECT * FROM person 
      WHERE username = $1
    `,
    [email],
  )

  const personParse = PersonSchema.safeParse(response.rows[0])

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
        SELECT * FROM public.person 
        INNER JOIN public.role ON role.role_id = person.role_id 
        WHERE role.name = $1
      `,
    [role],
  )

  response.rows.map((row) => PersonSchema.safeParse(row)).filter(parse => parse.success)

  const personParse = PersonSchema.safeParse(response.rows[0])

  if (personParse.success) return personParse.data

  return null
}
