import crypto from 'crypto'

export interface TokenEntry {
  personId: number
  expires: Date
}

const generateToken = async () =>
  new Promise<string>((resolve, reject) =>
    crypto.randomBytes(64, (err, key) =>
      err ? reject(err) : resolve(key.toString('hex')),
    ),
  )

const defaultValidity = 1000 * 60 * 60 * 24

type TokenGenerator = () => Promise<string> | string

export class TokenManager {
  #tokenStore
  #tokenValidity
  #tokenGenerator

  /**
   *
   * @param tokenValidity How long a token is valid in ms
   * @param tokenGenerator a generator function for the identifiers/tokens
   */
  constructor(
    tokenValidity: number | null = null,
    tokenGenerator: TokenGenerator | null = null,
  ) {
    this.#tokenStore = new Map<string, TokenEntry>()
    this.#tokenValidity = tokenValidity ?? defaultValidity
    this.#tokenGenerator = tokenGenerator ?? generateToken
  }

  /**
   * Creates a new token linked to a personId
   * @param personId the id to link the token to
   * @returns the generated token as `string`
   */
  async createToken(personId: number) {
    const token = await this.#tokenGenerator()

    this.#tokenStore.set(token, {
      personId,
      expires: new Date(Date.now() + this.#tokenValidity),
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
      expires: new Date(Date.now() + this.#tokenValidity),
    })

    return personId
  }

  /**
   * Delete a token.
   * @param token the token of the entry delete
   */
  deleteToken(token: string) {
    this.#tokenStore.delete(token)
  }
}

const tokenManager = new TokenManager()

export default tokenManager
