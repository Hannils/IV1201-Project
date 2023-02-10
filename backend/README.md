# Backend

# Design & Development

1. Node - Environment
1. Express - Request handler
1. Firebase admin - Authentication
1. Pg - Relational database management
1. Zod - Validation
1. Cors - For cors (security)
1. Prettier - Formatting
1. TypeScript - Language
1. Eslint - Linting
   - eslint-config-prettier - eslint integration with prettier
   - eslint-plugin-import - "to Support linting of ES2015+ (ES6+) import/export syntax,
     and prevent issues with misspelling of file paths and import names"
   - eslint-plugin-prettier - eslint with prettier
   - eslint-plugin-react - elint with react
   - eslint-plugin-simple-import-sort - sort imports
   - eslint-plugin-unused-imports - Remove unused imports




# JSDoc how-to

## Document express endpoint
```TypeScript
/**
 * This method creates a new user and sends response
 * @param req - Contains the request data
 * @param res - Contains the response data
 * - `200`: 200 success description
 * - `400`: 400 bad request description
 * - `500`: 500 server error description
 * @requestParams
 * - `param1`: description
 * - `param2`: description
 * - `param2`: description
 * @requestBody 
 * - `key1` Description kinda like:
 * - `key2` follows {@link schemas.firstnameSchema},
 * 
 * @responseBody
 * **200**
 * - `key1`: value1
 * - `key2`: value2
 * 
 * **500**
 *  - `key1`: value1
 *  - `key2`: value2
 * 
 * @returns `void`
 * @authorization none | Role | Role[]
 */
```
