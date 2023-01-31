interface TokenEntry {
  personId: number
  expires: Date
}

export const TOKEN_VALIDITY = 1000 * 60 * 60 * 24

const tokenStore = new Map<string, TokenEntry>()
export default tokenStore
