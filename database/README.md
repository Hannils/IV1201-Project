# Database

## Migrating database
To migrate existing-database.sql do the following:
psql -f <P>.sql -U my_login_role -d db_name 
or
from inside the SQLShell
\i /THE_DATABASE_PATH

## Queries

- Select all applicants

    `SELECT * FROM public.person WHERE role_id = 2;`

- Note: The availability_id column is used to show the application status, assuming that availability_id is NULL means the person has not applied yet, otherwise it means the person has applied and the value of availability_id is the application status.

    ```sql
    SELECT name || ' ' || surname as full_name, role_id, availability_id
    FROM public.person
    LEFT JOIN public.availability ON public.person.person_id = public.availability.person_id
    WHERE role_id = 2;```

- list the existing 10 Applicants with the most experience

    ```sql
    SELECT p.name, p.surname, cp.years_of_experience
    FROM public.person p
    JOIN public.competence_profile cp ON p.person_id = cp.person_id
    WHERE p.role_id = 2
    ORDER BY cp.years_of_experience DESC
    LIMIT 10;```


- show the availability for all Applicants in a specific time period

    ```sql
    SELECT p.name, p.surname, a.from_date, a.to_date
    FROM public.person p
    JOIN public.availability a ON p.person_id = a.person_id
    WHERE p.role_id = 2 AND a.from_date <= 'specific_date' AND a.to_date >= 'specific_date'
    ORDER BY p.name;```
