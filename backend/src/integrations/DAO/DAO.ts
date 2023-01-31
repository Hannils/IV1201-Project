import { Client, QueryResult } from 'pg'


let client: Client | undefined

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

export async function queryDatabase(query: string, data: any[]): Promise<QueryResult<any>> {
  return new Promise((resolve, reject) => {
    if (client === undefined) throw new Error('Client not initialized')
    client.query(query, data, (err, res) => {
      if (err) {
        console.error(err)
        return reject(err.message)
      }
      resolve(res)
    })
  })
}


