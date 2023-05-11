# Gemeinschaftswerk Nachhaltigkeit | Portal App

[![Maven Build and Test](https://github.com/GemeinschaftswerkNachhaltigkeit/gw-portal-app/actions/workflows/buildAndTest.yml/badge.svg)](https://github.com/GemeinschaftswerkNachhaltigkeit/gw-portal-app/actions/workflows/buildAndTest.yml)  [![Java CI with Maven](https://github.com/GemeinschaftswerkNachhaltigkeit/gw-portal-app/actions/workflows/buildAndPush.yml/badge.svg)](https://github.com/GemeinschaftswerkNachhaltigkeit/gw-portal-app/actions/workflows/buildAndPush.yml)

## Getting started / Installation

### Git Hooks (Frontend & Backend)
- in Projekt-root: `npm install` 

### Backend
- running test
  - docker needed (PostgreSQL)
  - mvn generate-sources
  - map sources directory
- running the backend
  - start docker-compose in directory `docker-compose`
  - `docker compose -f docker-compose-dev.yml up -d`
    - Troubleshooting: DBs were not created 
      - Error message in docker log: `/docker-entrypoint-initdb.d/create-multiple-postgresql-databases.sh: /bin/bash^M bad interpreter: No such file or directory`
      - Solution: `sed -i -e 's/\r$//' create-multiple-postgresql-databases.sh` siehe [stackoverflow](https://stackoverflow.com/questions/14219092/bash-script-and-bin-bashm-bad-interpreter-no-such-file-or-directory)

  - Setup Postgis
    - connect to PostgreSQL Container
    - `docker exec -it docker-compose-postgres-1 bash`
    - `# psql -U postgres`
    - `# \connect wpgwn_app`
    - `# CREATE EXTENSION postgis;`
    - `# CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    - `# CREATE EXTENSION IF NOT EXISTS pg_trgm;`
  - use `dev` profile for development
  - start the app

  - configure Keycloak  
    - create _confidential_ client with only `Direct Access Grants Enabled` active in the keycloak `master` realm
    - create a user in the _master_ realm. Set password credentials
      - user credentials must be configured in application.yaml. See application-dev.yaml for reference.
      - assign the following roles for client `wpgwn-realm`
        - manage-realm
        - manage-users
        - view-users
        - query-groups
        - view-clients
      

### Frontend

Run the following commands to start the angular frontend app 

- `cd frontend` 
- ` npm install` 
- ` ng serve`

## License
GNU Affero General Public License v3.0
