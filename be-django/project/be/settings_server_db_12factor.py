import os

import dj_database_url

from .settings import *

DATABASES['default'] = dj_database_url.config(conn_max_age=600, ssl_require=os.getenv("BE_REQUIRE_SSL", "true").lower() != "false")

ALLOWED_HOSTS = [os.getenv("BE_ALLOWED_HOSTS")]

DEBUG = False

