#!/bin/bash

# build all custom docker images referenced in app.yml
# TODO: add prerequisite steps

cd ../

# be
docker build -t csa_vc_be -f ./be-django/Complete.Dockerfile ./be-django &

# fe
# just copies the built app from dist/
# npm install && ng build --prod
docker build -t csa_vc_fe -f ./fe/feapp/Complete.Dockerfile ./fe/feapp &

# osrm
# requires the preprocessed osm data in osrm/data
docker build -t csa_vc_osrm -f ./osrm/Dockerfile ./osrm &

wait

printf "\nall images built\n\n"
