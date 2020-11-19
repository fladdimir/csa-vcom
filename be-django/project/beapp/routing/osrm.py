# source: https://github.com/ustroetz/python-osrm/
# (apdated due to package installation problems because of the GDAL dependency)

import json
from urllib.parse import quote
from urllib.request import Request, urlopen

import numpy as np
from polyline import encode as polyline_encode


class DefaultRequestConfig:
    def __init__(self):
        self.host = "http://localhost:5000"
        self.profile = "driving"
        self.version = "v1"
        self.auth = None

    def __str__(self):
        return "/".join([self.host, "*", self.version, self.profile])

    def __repr__(self):
        return "/".join([self.host, "*", self.version, self.profile])


RequestConfig = DefaultRequestConfig()


def _chain(*lists):
    for li in lists:
        for elem in li:
            yield elem


def check_host(host):
    """ Helper function to get the hostname in desired format """
    if not ("http" in host and "//" in host) and host[len(host) - 1] == "/":
        return "".join(["http://", host[: len(host) - 1]])
    elif not ("http" in host and "//" in host):
        return "".join(["http://", host])
    elif host[len(host) - 1] == "/":
        return host[: len(host) - 1]
    else:
        return host


def nearest(coord):
    """
    Wrapping OSRM 'nearest' function, returning the reponse in JSON
    Parameters
    ----------
    coord : list/tuple of two floats
        (x ,y) where x is longitude and y is latitude
    Returns
    -------
    result : dict
        The response from the osrm instance, parsed as a dict
    """
    number = 1
    url_config = RequestConfig
    host = check_host(url_config.host)
    url = "".join(
        [
            host,
            "/nearest/",
            url_config.version,
            "/",
            url_config.profile,
            "/",
            ",".join(map(str, coord)),
            "?number={}".format(number),
        ]
    )
    req = Request(url)
    if url_config.auth:
        req.add_header("Authorization", url_config.auth)
    rep = urlopen(req)
    parsed_json = json.loads(rep.read().decode("utf-8"))
    return parsed_json


def table(coords_src, coords_dest):
    """
    Function wrapping OSRM 'table' function in order to get a matrix of
    time distance as a numpy array
    Parameters
    ----------
    coords_src : list
        A list of coord as (longitude, latitude) , like :
             list_coords = [(21.3224, 45.2358),
                            (21.3856, 42.0094),
                            (20.9574, 41.5286)] (coords have to be float)
    coords_dest : list
        A list of coord as (longitude, latitude) , like :
             list_coords = [(21.3224, 45.2358),
                            (21.3856, 42.0094),
                            (20.9574, 41.5286)] (coords have to be float)
    Returns
    -------
    sa numpy.ndarray containing the time in minutes,
    sa list of snapped origin coordinates,
    sa list of snapped destination coordinates.
    """
    annotations = "duration"
    url_config = RequestConfig
    host = check_host(url_config.host)
    url = "".join([host, "/table/", url_config.version, "/", url_config.profile, "/"])

    src_end = len(coords_src)
    dest_end = src_end + len(coords_dest)
    url = "".join(
        [
            url,
            "polyline(",
            quote(
                polyline_encode([(c[1], c[0]) for c in _chain(coords_src, coords_dest)])
            ),
            ")",
            "?sources=",
            ";".join([str(i) for i in range(src_end)]),
            "&destinations=",
            ";".join([str(j) for j in range(src_end, dest_end)]),
            "&annotations={}".format(annotations),
        ]
    )

    req = Request(url)
    if url_config.auth:
        req.add_header("Authorization", url_config.auth)
    rep = urlopen(req)
    parsed_json = json.loads(rep.read().decode("utf-8"))

    if "code" not in parsed_json or "Ok" not in parsed_json["code"]:
        raise ValueError("No distance table return by OSRM instance")

    annoted = np.array(parsed_json["{}s".format(annotations)], dtype=float)
    new_src_coords = [ft["location"] for ft in parsed_json["sources"]]
    new_dest_coords = [ft["location"] for ft in parsed_json["destinations"]]

    return annoted, new_src_coords, new_dest_coords
