import os
from typing import Any, Dict

from requests import get, post, patch

DEFAULT_BE_URL = "http://localhost:7000"
BE_URL_KEY = "BE_URL"
BASE_URL = os.environ.get(BE_URL_KEY, DEFAULT_BE_URL)


def do_get(path: str, base_url=BASE_URL) -> Any:
    response = get(base_url + path)
    _raise_error_if_not_ok(response)
    return response.json()


def do_post(path: str, body: Dict[str, Any]) -> Any:
    response = post(BASE_URL + path, json=body)
    _raise_error_if_not_ok(response)
    return response.json()


def do_patch(path: str, body: Dict[str, Any]) -> Any:
    response = patch(BASE_URL + path, json=body)
    _raise_error_if_not_ok(response)
    return response.json()


def _raise_error_if_not_ok(response) -> Any:
    if not response.ok:
        text = response.text[: min((len(response.text), 200))]
        raise AssertionError(
            f"Request failed: {text}\n\nrequest: {str(response.request.body)}"
        )
    return response
