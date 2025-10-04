#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
GIT_URL=$(git config --get remote.origin.url)
/usr/bin/env bash $SCRIPT_DIR/build.sh

(
    cd app/dist/app/browser
    git init
    git checkout -b gh-pages
    git add .
    git commit -m publish
    git remote add origin $GIT_URL
    git push origin gh-pages --force
)
