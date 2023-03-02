# IV1201-Project

## Backend-code

Backend code is placed in `backend` folder

## Frontend-code

Frontend code is placed in `frontend` folder

## Database

Database SQL is placed in `database` folder

# Try out the application

Here is a small tutorial on how to run the project.

## Deployed application

A live demo of the project is deployed can be seen on [recruitment-application.netlify.app](https://recruitment-application.netlify.app)  
*NOTE: The backend is initially slow so refresh a few times if it doesn't load within about a minute*

## Run it locally

- Clone the repo
- Make sure Postgres is installed and running
- Create a new empty database
- Open a terminal
- cd in `./database` folder 
  - Run the `SQL` dump using the command in the [README](https://github.com/Hannils/IV1201-Project/tree/main/database#migrating-database)
- cd in `./backend`
  - create and configure a `.env.local` file with the configurations for the database [hint](https://github.com/Hannils/IV1201-Project/blob/main/backend/src/integrations/DAO/DAO.ts#L8).
  - create and configure a `.env` file with the entry `PORT` set it to an unused port i.e. 8888.
  - run `yarn`
  - run `yarn dev-conf`
  - run `yarn dev`
- Open a new terminal instance
- cd in  `./frontend`
  - Create a `.env` file and add an entry `VITE_API_URL` set it to `http://localhost:PORT` where PORT is the port you set for the backend
  - run `yarn`
  - run `yarn dev`

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
