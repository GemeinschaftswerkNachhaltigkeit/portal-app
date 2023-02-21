# WPGWN App

- 
## Badges

### Frontend: 
[![Quality Gate Status](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Afrontend&metric=alert_status&token=745cab5211ef78dfa409d02019705c3efa2d64e2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Afrontend)
[![Security Rating](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Afrontend&metric=security_rating&token=745cab5211ef78dfa409d02019705c3efa2d64e2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Afrontend)
[![Vulnerabilities](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Afrontend&metric=vulnerabilities&token=745cab5211ef78dfa409d02019705c3efa2d64e2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Afrontend)
[![Maintainability Rating](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Afrontend&metric=sqale_rating&token=745cab5211ef78dfa409d02019705c3efa2d64e2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Afrontend)
[![Bugs](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Afrontend&metric=bugs&token=745cab5211ef78dfa409d02019705c3efa2d64e2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Afrontend)
[![Coverage](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Afrontend&metric=coverage&token=745cab5211ef78dfa409d02019705c3efa2d64e2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Afrontend)

### Backend: 
[![Quality Gate Status](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Abackend&metric=alert_status&token=2f4265b576e321a53336da0952c342d7257ff4c2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Abackend)
[![Security Rating](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Abackend&metric=security_rating&token=2f4265b576e321a53336da0952c342d7257ff4c2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Abackend)
[![Vulnerabilities](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Abackend&metric=vulnerabilities&token=2f4265b576e321a53336da0952c342d7257ff4c2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Abackend)
[![Maintainability Rating](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Abackend&metric=sqale_rating&token=2f4265b576e321a53336da0952c342d7257ff4c2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Abackend)
[![Bugs](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Abackend&metric=bugs&token=2f4265b576e321a53336da0952c342d7257ff4c2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Abackend)
[![Coverage](https://sonarqube.lej.eis.network/api/project_badges/measure?project=com.exxeta.wpgwn%3Awpgwn%3Afrontend&metric=coverage&token=745cab5211ef78dfa409d02019705c3efa2d64e2)](https://sonarqube.lej.eis.network/dashboard?id=com.exxeta.wpgwn%3Awpgwn%3Afrontend)

## Visuals
Some Screenshots

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


## Roadmap
Next steps

## Contributing
how...

## License
GNU General Public License v3.0 ??

## Project status
Beta
