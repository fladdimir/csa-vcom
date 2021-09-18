#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "be.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    from django.core.management.commands.runserver import Command as runserver

    runserver.default_addr = "0.0.0.0"
    runserver.default_port = "7000"

    # sys.argv = ["project/manage.py", "runserver"]  # debug

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
