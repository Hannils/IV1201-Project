# Database

## Migrating database

To migrate existing-database.sql do the following:
`psql -f <P>.sql -U my_login_role -d db_name`
or
from inside the SQLShell
\i /THE_DATABASE_PATH

# Architectural decisions for database

<details>
  <summary>User table</summary>

The user table is updated with a `salt`. This is used for the encryption of the passwords.

</details>
<details>
  <summary>status</summary>

The `status` table is similar to the `role` table with three different states
This table is used to keep track of applications

- `unhandled`
- `rejected`
- `accepted`
</details>
<details>
  <summary>application</summary>

The application table contains the status of an application for a specific oppurtunity.
application_id: FK with application table
person_id: FK with person table
status_id: FK with status table
year: The year of the oppurtunity to keep track of what year the status corresponds to. TODO change to oppurtunity_id
</details>
<details>
  <summary>Opputunity</summary>

TODO

</details>
<details>
  <summary> More stuff...</summary>
</details>

## Queries

- Select all applicants

  ````sql
  SELECT * FROM public.person WHERE role_id = 2;```

  ````

- Note: The availability_id column is used to show the application status, assuming that availability_id is NULL means the person has not applied yet, otherwise it means the person has applied and the value of availability_id is the application status.

  ````sql
  SELECT name || ' ' || surname as full_name, role_id, availability_id
  FROM public.person
  LEFT JOIN public.availability ON public.person.person_id = public.availability.person_id
  WHERE role_id = 2;```

  ````

- list the existing 10 Applicants with the most experience

  ````sql
  SELECT p.name, p.surname, cp.years_of_experience
  FROM public.person p
  JOIN public.competence_profile cp ON p.person_id = cp.person_id
  WHERE p.role_id = 2
  ORDER BY cp.years_of_experience DESC
  LIMIT 10;```

  ````

- show the availability for all Applicants in a specific time period

  ````sql
  SELECT p.name, p.surname, a.from_date, a.to_date
  FROM public.person p
  JOIN public.availability a ON p.person_id = a.person_id
  WHERE p.role_id = 2 AND a.from_date <= 'specific_date' AND a.to_date >= 'specific_date'
  ORDER BY p.name;```
  ````
