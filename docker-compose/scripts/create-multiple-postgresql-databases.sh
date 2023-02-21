#!/bin/bash

set -e
set -u

function create_user_and_database() {
	local database=$1
	local username=$2
	local password=$3
	echo "  Creating database with username '$database', '$username', '*****'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
	    CREATE DATABASE $database;
	    CREATE USER $username WITH ENCRYPTED PASSWORD '$password';
	    GRANT ALL PRIVILEGES ON DATABASE $database TO $username;
EOSQL
  echo "  Done creating database."
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	DATABASES=(${POSTGRES_MULTIPLE_DATABASES//,/ })
	USERNAMES=(${POSTGRES_MULTIPLE_DATABASES_USERNAMES//,/ })
	PASSWORDS=(${POSTGRES_MULTIPLE_DATABASES_PASSWORDS//,/ })

	for i in "${!DATABASES[@]}"; do
		create_user_and_database ${DATABASES[$i]} ${USERNAMES[$i]} ${PASSWORDS[$i]}
	done
	echo "Multiple databases created"
fi
