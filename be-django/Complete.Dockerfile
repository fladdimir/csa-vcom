FROM python:3.8
ENV PYTHONUNBUFFERED 1
WORKDIR /usr/src
COPY ./requirements.txt ./
RUN pip3 install -r requirements.txt
ENV DJANGO_SETTINGS_MODULE=be.settings_server_db
ENV DB_HOST=postgres
ENV OSRM_HOST=http://osrm:5000
COPY . .
RUN chmod +x ./start.sh
CMD ["./start.sh"]
