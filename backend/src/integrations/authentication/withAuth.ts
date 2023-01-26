import passport from 'passport'
import local from 'passport-local'
import { selectPersonByUsername } from '../DAO/userDAO'
import crypto from 'crypto'

passport.use(
  new local.Strategy(async function verify(username, password, cb) {
    try {
      const person = await selectPersonByUsername(username)

      if (person === null)
        return cb(null, false, { message: 'Incorrect username or password.' })

      crypto.pbkdf2(
        password,
        person.salt,
        310000,
        32,
        'sha256',
        function (err, hashedPassword) {
          if (err) {
            return cb(err)
          }
          if (
            !crypto.timingSafeEqual(Buffer.from(person.password, 'utf-8'), hashedPassword)
          ) {
            return cb(null, false, { message: 'Incorrect username or password.' })
          }
          return cb(null, person)
        },
      )
    } catch (error) {
      cb(error)
    }
  }),
)
