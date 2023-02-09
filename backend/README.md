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

### Example general fucntion
```TypeScript
/**
 * Calls database and selects a competence profile for a specific person (Short description)
 * @param personId - Id of the person as `number` (Describe the param and type)
 * @returns CompetenceProfile[] (Return type)
 */
function selectCompetenceProfile(personId: number) {
  /* ... */
}
```

### Example endpoint
```TypeScript
/**
 * This method Signs in an existing user
 * @param req - Request containing  `username: string` & `password: string`
 * @param res - Either `200` or `404`
 * @returns
 */
const getCompetences: express.RequestHandler = async (req, res) => {
/* ... */
}
```
