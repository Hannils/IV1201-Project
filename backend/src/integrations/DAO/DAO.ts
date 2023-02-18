import { Client, QueryResult } from 'pg'
let client: Client | undefined
/**
 * This function initialize the database connection
 */
export async function initDatabase() {
  client = new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
  })

  console.log('Connecting to database...')
  await client.connect()
  console.log('Database connected successfully')
}
/**
 * Executes query and returns result
 * @param query - Query to execute as `string`
 * @param data - Optional data to execute with query as `any[]`
 * @returns - Result from query as {@link QueryResult}
 * @example ```javascript
 * await queryDatabase(`SELECT * FROM TABLE WHERE id = $1`, [dataToReplacewith$1])
 * ```
 */

export async function queryDatabase(query: string, data: any[]): Promise<QueryResult> {
  return new Promise((resolve, reject) => {
    if (client === undefined) return reject('Client not initialized')
    client.query(query, data, (err, res) => {
      if (err) {
        console.error(err)
        return reject(err.message)
      }
      resolve(res)
    })
  })
}

export async function doTransaction<ResolvedValue = void>(
  transationFunction: () => Promise<ResolvedValue>,
) {
  if (client === undefined) throw new Error('Client not initialized')

  try {
    await client.query('BEGIN')
    await transationFunction()
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  }
}
