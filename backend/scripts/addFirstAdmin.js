const admin = require('firebase-admin')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({
  path: path.resolve(__dirname, '../.env.local'),
})

async function run() {
  console.log(process.env)
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.type,
      project_id: process.env.project_id,
      private_key_id: process.env.private_key_id,
      private_key: process.env.private_key,
      client_email: process.env.client_email,
      client_id: process.env.client_id,
      auth_uri: process.env.auth_uri,
      token_uri: process.env.token_uri,
      auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
      client_x509_cert_url: process.env.client_x509_cert_url,
    }),
  })

  const { uid } = await admin.auth().createUser({
    displayName: 'root',
    password: 'adminadmin',
    email: 'kalle@elmdahl.se',
  })

  await admin.auth().setCustomUserClaims(uid, { role: 'recruiter' })
}

run()
