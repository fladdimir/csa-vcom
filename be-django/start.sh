#!/bin/bash
cd ./project
python3 manage.py migrate
gunicorn --bind 0.0.0.0:7000 --workers=2 'be.wsgi:application'