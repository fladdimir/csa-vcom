import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DB_REL_PATH_DEFAULT = "db.sqlite3"
DB_REL_PATH_KEY = "DB_REL_PATH"
DB_REL_PATH = os.environ.get(DB_REL_PATH_KEY, DB_REL_PATH_DEFAULT)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "islu*f+$=+j^4)mx+m^#lk4=5piz3n=g(zk3czchcd4-ychz5%"

# SECURITY WARNING: don"t run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["localhost", "be", "backend-service"]

INSTALLED_APPS = [
    "beapp.apps.BeappConfig",
    "corsheaders",
    "rest_framework",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "be.urls"

WSGI_APPLICATION = "be.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, DB_REL_PATH),
        "ATOMIC_REQUESTS": True,
    }
}

STATIC_URL = "/static/"

# DRF
REST_FRAMEWORK = {"UNAUTHENTICATED_USER": None}

TEMPLATES = [
    {"BACKEND": "django.template.backends.django.DjangoTemplates", "APP_DIRS": True,},
]

# corsheaders
CORS_ORIGIN_ALLOW_ALL = True
