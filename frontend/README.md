# Frontend

## Design & Development packages

1. Vite - For development
1. React - For rendering
1. MUI - Component library & styling + theming
1. React Router - Routing within the application
1. Axios - simplifying api
1. Firebase admin - Managing authentication
1. Prettier - Formatting
1. TypeScript - Language
1. Eslint - Linting
   - eslint-config-prettier - eslint integration with prettier
   - eslint-plugin-import - "to Support linting of ES2015+ (ES6+) import/export syntax,
     and prevent issues with misspelling of file paths and import names"
   - eslint-plugin-jsx-a11y - spot accessibility issues
   - eslint-plugin-prettier - eslint with prettier
   - eslint-plugin-react - elint with react
   - eslint-plugin-simple-import-sort - sort imports
   - eslint-plugin-unused-imports - Remove unused imports

## Architectural decisions for frontend

<details open>
  <summary>(M)VP - (Model) View Presenter</summary>

In the frontend we use a variation of the pattern model view presenter. We have a set of
rules to go by.

### Model/Context
- For each page create a context with api calls for persisting data from the client
  - if the page only does one thing, this is not needed


### Presenter

The presenter should provide the context and contain queries for fetching data when the
page loads.

### Views

- The view should (most likely) be split up into multiple files.
- Each file should do (one) thing.
- Grouping different views counts as one thing.

</details>

<details>
<summary>API object</summary>

The API object should contain all backend enpoints used for communication with the backend.
</details>

<details>
<summary>Tanstack query (useQuery and useMutation)</summary>

[API reference and docs](https://tanstack.com/query/v3/)

### useQuery
The useQuery hook must be used in the presenters for fetching initial data when the presenter loads

### useMutation
The useMutation hook must be used when presisting data to the backend. The mutations are placed in the contexts or in the presenter.
</details>