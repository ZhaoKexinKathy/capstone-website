#!/bin/bash
# Script for easy running of both frontend and backend
#
# Usage:
# sh start_app.sh
#

PORT=3001

# Catch terminate signal to kill all background processes
trap "trap - TERM && kill -- -$$" INT TERM EXIT

echo '\033[0;32mStarting FaceCookBook\033[0m'
echo

start_backend() {
    echo "> Creating virtual environment"
    python3 -m venv .venv > /dev/null 2>&1
    . ./.venv/bin/activate > /dev/null 2>&1 || . .venv/bin/activate > /dev/null 2>&1
    echo "Virtual env running with path : ${VIRTUAL_ENV}"
    # install backend dependencies to venv
    echo "> Installing backend dependencies"
    python3 -m pip install -r requirements.txt > /dev/null 2>&1

    cd backend/

    # create/migrate sqlite database
    echo "> Creating databases"
    python3 manage.py migrate --run-syncdb > /dev/null 2>&1
    echo "> Starting backend"
    python3 manage.py runserver $PORT || echo "\033[0;31mFailed to start backend. Port ${PORT} might be used?\033[0m"
}

start_frontend() {
    cd frontend/
    echo '> Installing frontend dependencies, this might take some time'
    npm install > /dev/null 2>&1
    echo '> Starting frontend'
    npm start > /dev/null 2>&1 && echo '\033[0;31mFailed to start frontend. The assigned frontend port might be used?\033[0m'
}

# Update node and npm version for vlab
# ~cs1531/bin/setup
# source ~/.bashrc

# start frontend and backend, but only show backend output
start_backend & start_frontend # run both in parallel to go faster

# echo '\033[0;32mApp is ready! (wait for browser to open)\033[0m'
# echo

#  cd '../backend/'; python3 manage.py runserver $PORT
# (npm start > /dev/null 2>&1) & (cd '../backend/'; python3 manage.py runserver $PORT)
