#!/bin/bash
# -e exit       when a command fails
# -u exit       when trying to use undefined variable
# -o pipefail   return the exit code of piped commands that fail
# -x            debug

# https://www.gnu.org/software/bash/manual/bashref.html#index-expansion_002c-parameter
# ${ENV_VAR?"Error message"}    Requires the ENV_VAR and gives human readable stderr
set -euo pipefail

PREFIX="[*]"

echo
echo $PREFIX "Waiting for db"
/app/wait

echo
echo $PREFIX "Django check"
python3 manage.py check

# echo
# echo $PREFIX "Creating static folder and collectstatic"
# mkdir -p /app/static && python3 manage.py collectstatic --no-input

echo
echo $PREFIX "Current migrations in database"
python3 manage.py showmigrations

echo
echo $PREFIX "Running migrations"
python3 manage.py migrate --no-input

echo
echo $PREFIX "ENV Variables"
echo $PREFIX "- DATABASE_URL" $DATABASE_URL

# Improvement
# echo $PREFIX "- APP_UID" $APP_UID
# echo $PREFIX "- APP_GID" $APP_GID
# echo $PREFIX "- SECRET_KEY" $SECRET_KEY

# UWSGI
# echo $PREFIX "- PROCESSES" $PROCESSES
# echo $PREFIX "- HARAKIRI_TIMEOUT" $HARAKIRI_TIMEOUT

# echo
# echo $PREFIX "Changing owner:group of /app to "$APP_UID":"$APP_GID
# chown -R $APP_UID:$APP_GID /app

exec "$@"
