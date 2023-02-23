const path = require('path')
const dotenv = require('dotenv')
const { Client, QueryResult } = require('pg')
const crypto = require('crypto')
const { readFileSync, writeFileSync } = require('fs')

dotenv.config({
  path: path.resolve(__dirname, '../.env.local'),
})

async function initDatabase() {
  client = new Client({
    host: process.env.CLOUD_DATABASE_HOST,
    user: process.env.CLOUD_DATABASE_USER,
    password: process.env.CLOUD_DATABASE_PASSWORD,
    port: Number(process.env.CLOUD_DATABASE_PORT),
    database: process.env.CLOUD_DATABASE_NAME,
    ssl: false //Change to true when change is needed
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


async function run() {
  const res = readFileSync("/Users/hampus.nilsson/Desktop/IV1201-Project/database/new-database.sql")
  await initDatabase()
  const response = await queryDatabase(res.toString())
  console.log(response)
  console.log("Encryption done")
}

run()
