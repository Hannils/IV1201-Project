# Backend

# Design & Development






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
 * @authorization `none` OR [`Role`] OR [`Role1` | `Role2`]
 */
```

# Architectural decisions for backend

<details open>
  <summary><b>What is used and why</b></summary>

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
  
</details>
<details open>
  <summary><b>File Structure / general backend architecture</b></summary>
  Files are split in 4 different folders. 

  - Integrations 
    - Contains everything which connects external services to the backend
    - DAOs (Data access object) are placed here such as the various  files. `./integrations/DAO/DAO.ts`
      - One DAO for one database table.
  - Middlewares
    - Contains everything which will be applied to **all** endpoints such as `./middlewares/useAuth.ts`
  - Routers
    - Contains everything that has to do with the various routes and endpoints which will be hosted on the backend such as `./routers/userRouter.ts`
    - Only one router-file per initial route is used. Example: Endpoint `localhost:8888/user` will lead to the `userRouter` file and can have multiple endpoints inside of it such as `localhost:8888/user/signin` but the same file is not applicable to `localhost:8888/competence`
  - Util
    - Contains everything which could not be applied to the previously mentioned folders. Such as types, interfaces and helper functions such as `./util/isAutorized.ts` to check if the user is authorized to access an endpoint or `./util/tokenManager.ts` for token generating and validating. 
</details>

<details open>
<summary><b>Security</b></summary>

- Security for user information
  - All the user passwords are hashed in the database using Crypto which is an built-in resource within Node. A table was added in the db for handling and storing the salt which was used in the hashing process. The hashing algorithm used is [sha256](https://en.wikipedia.org/wiki/SHA-2)
- Security for endpoints
  - The endpoints are access-controlled by the role of each user. Theses roles are saved in the correspondent row in the database for each user. 
- CORS
  - Cross-origin resource sharing will be used for the project in order to protect the application from various exploitable vulnerabilities.
</details>


<details open>
<summary><b>Testing</b></summary>

There will be one type of automated testing for the backend

- Unit testing
  - The tests are extensive and covers all of the functions used by the endpoints. Although the production-database will not be used, instead the tests will be performed on an identical copy of the production-database.

</details>