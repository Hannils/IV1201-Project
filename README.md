# IV1201-Project

## Backend-code

Backend code is placed in `backend` folder

## Frontend-code

Frontend code is placed in `frontend` folder

## Database

Database SQL is placed in `database` folder
 


## JSDoc guidlines

### Parameters and other specifications

- if type is primitive, use ***backticks***. Example: \`number\`
- if type is NOT primitive, use {@link *type*}
- if non primitive is array, use {@link *type*}[]

- DO NOT specify type within brackets: 
    - BAD: @param {string} id *Explaination here...*
    - OKAY: @param  id as \`number\` *Explaination here...*
    - GOOD: @param  id *Explaination here...*

### Returns

- if return is void, use ***backticks***. Example: \`void\`
- if return is not void, see **Parameters and other specifications** above

```javascript
/**
 * Calls database and selects a competence profile for a specific person (Short description)
 * @param personId - Id as `number`
 * @returns competence profile as {@link CompetenceProfile}
 */
function selectCompetenceProfile(personId: number) {
  /* ... */
}
```