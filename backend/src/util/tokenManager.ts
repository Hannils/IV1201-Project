import crypto from 'crypto'

export interface TokenEntry {
  personId: number
  expires: Date
}

export class TokenManager {
  static #TOKEN_VALIDITY = 1000 * 60 * 60 * 24
  #tokenStore

  constructor() {
    this.#tokenStore = new Map<string, TokenEntry>()
  }

  /**
   * Creates a new token linked to a personId
   * @param personId the id to link the token to
   * @returns the generated token as `string`
   */
  async createToken(personId: number) {
    const token = await new Promise<string>((resolve, reject) =>
      crypto.randomBytes(64, (err, key) =>
        err ? reject(err) : resolve(key.toString('hex')),
      ),
    )

    this.#tokenStore.set(token, {
      personId,
      expires: new Date(Date.now() + TokenManager.#TOKEN_VALIDITY),
    })

    return token
  }

  /**
   * Validate a token
   * @param token the token to check
   * @returns `null` if token is invalid or expired | `personId` of the person with the specific token
   */
  validateToken(token: string) {
    const tokenEntry = this.#tokenStore.get(token)
    if (tokenEntry === undefined) return null

    const { personId, expires } = tokenEntry

    if (Date.now() > expires.getTime()) return null

    this.#tokenStore.set(token, {
      personId,
      expires: new Date(Date.now() + TokenManager.#TOKEN_VALIDITY),
    })

    return personId
  }
}

const tokenManager = new TokenManager()

export default tokenManager
