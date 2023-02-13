# IV1201-Project

## Backend-code

Backend code is placed in `backend` folder

## Frontend-code

Frontend code is placed in `frontend` folder

## Database

Database SQL is placed in `database` folder

## JSDoc guidlines

### Parameters and other specifications

- if type is primitive, use **_backticks_**. Example: \`number\`
- if type is NOT primitive, use {@link _type_}
- if non primitive is array, use {@link _type_}[]

- DO NOT specify type within brackets:
  - BAD: @param {string} id _Explaination here..._
  - OKAY: @param id as \`number\` _Explaination here..._
  - GOOD: @param id _Explaination here..._

### Returns

- if return is void, use **_backticks_**. Example: \`void\`
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

## Creating and managing pull requests

Some information about contributing to the code.

### Creating and managing PRs

Currently we have not and requirements for this

### Merging PRs

Before anything can be merged this checklist must be completed

#### Prerequisits

- All code compiles and no new linting errors.
- Works locally

#### Before merging

- Manually Test all logic in the frontend in Chrome, Firefox and Safari.
- There must be backend unit tests for all new code.
- Make sure everything looks well and is accessible. (Maybe have a look in [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/))
  - Too small texts
  - Hard to understand UI elements (Bad UX)
- Make sure code is clean and follows guidlines see "Architectural decisions" for each part of the project
