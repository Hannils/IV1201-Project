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
    ssl: true,
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

/**
 * Executes a transaction using the specified transaction function.
 * @param transactionFunction - The function to execute as part of the transaction.
 * @returns A promise that resolves after the transaction is committed or rejects if there is an error.
 * @throws `Error` If the client is not initialized or if an error occurs during the transaction.
 * @description
 * This function wraps the specified `transactionFunction` in a database transaction. It executes the function,
 * then commits the transaction if successful, or rolls back the transaction if there is an error.
 * If the function returns a promise that resolves with a value, that value is returned.
 */

export async function doTransaction<ResolvedValue = void>(
  transationFunction: () => Promise<ResolvedValue>,
) {
  if (client === undefined) throw new Error('Client not initialized')

  try {
    await client.query('BEGIN')
    const result = await transationFunction()
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  }
}
