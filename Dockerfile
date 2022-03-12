# single image containing the whole application

# build fe app
FROM node:lts-alpine as fe_build
WORKDIR /app
COPY fe/feapp/package*.json ./
RUN npm install
COPY fe/feapp .
RUN npm run ng build -- --prod
# fe in /app/dist/feapp

# heroku image, based on osrm, with nginx + python
FROM osrm/osrm-backend:v5.22.0
# verify osrm:
RUN /usr/local/bin/osrm-extract --help && \
    /usr/local/bin/osrm-routed --help && \
    /usr/local/bin/osrm-contract --help && \
    /usr/local/bin/osrm-partition --help && \
    /usr/local/bin/osrm-customize --help

# install nginx
RUN apt-get update && apt-get install -y nginx gettext-base && apt-get clean && rm -rf /var/lib/apt/lists/

# install python on debian = build from source ..?
WORKDIR /
RUN apt-get update && apt-get install -y wget build-essential libffi6 libffi-dev zlib1g-dev libssl-dev && apt-get clean && rm -rf /var/lib/apt/lists/
RUN wget https://www.python.org/ftp/python/3.8.12/Python-3.8.12.tgz
RUN tar xvf Python-3.8.12.tgz
WORKDIR /Python-3.8.12
RUN ./configure --enable-shared --with-ensurepip=install
RUN make -j8
RUN make install
ENV LD_LIBRARY_PATH=/Python-3.8.12
RUN python3 --version && pip3 --version

# be dependencies
WORKDIR /be
COPY be-django/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# helper
COPY heroku/wait-for-it.sh /
RUN chmod a+x /wait-for-it.sh

# be
COPY be-django /be
ENV DJANGO_SETTINGS_MODULE=be.settings_server_db_12factor
ENV OSRM_HOST=http://localhost:5000

# osrm data
# requires download + preprocessing in osrm/data
COPY osrm/data /data

# nginx config
COPY heroku/etc_nginx/ /etc/nginx/
# fe build
COPY --from=fe_build app/dist/feapp /usr/share/nginx/html/

ENV PYTHONUNBUFFERED=1
ENV BE_ALLOWED_HOSTS="delivery-planning-hh.herokuapp.com"

CMD ["/bin/bash", "-c", \
    "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;' \
    & ( osrm-routed --algorithm mld /data/hamburg-latest.osrm ) \
    & \
    ( /wait-for-it.sh 127.0.0.1:5000 && \
    cd /be/project && python3 manage.py migrate && gunicorn --bind 127.0.0.1:7000 --workers=2 'be.wsgi:application' ) \
    "]
