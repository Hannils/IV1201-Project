const path = require('path')
const dotenv = require('dotenv')
const { Client, QueryResult } = require('pg')
const crypto = require('crypto')

dotenv.config({
  path: path.resolve(__dirname, '../.env.local'),
})

async function initDatabase() {
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

async function queryDatabase(query, data) {
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

const selectQuery = `SELECT * FROM public.person WHERE person.role_id = 1 AND person.salt IS NULL`
const updateQuery = `UPDATE public.person SET password = $1, salt = $2 WHERE person_id = $3`

async function run() {
  await initDatabase()
  console.log("Encrypting...")
  const res = await queryDatabase(selectQuery)
  for await (const row of res.rows) {
    const salt = crypto.randomBytes(16)
    const encryptedPassword = await new Promise((resolve, reject) => {
      crypto.pbkdf2(row.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) reject(err)
        return resolve(hashedPassword)
      })
    })
    await queryDatabase(updateQuery, [
      encryptedPassword.toString('hex'),
      salt.toString('hex'),
      row.person_id,
    ])
  }
  console.log("Encryption done")
}

run()
